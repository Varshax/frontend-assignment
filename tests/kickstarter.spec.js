import { test, expect } from "@playwright/test";

test.describe("Kickstarter Projects Table", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("shows loader initially", async ({ page }) => {
    const loader = page.getByRole("generic", { name: "Loading" });
    await expect(loader).toBeVisible();
  });

  test("displays table with correct headers", async ({ page }) => {
    await page.waitForSelector("table");
    const headers = await page.$$eval("th", (ths) =>
      ths.map((th) => th.textContent)
    );
    expect(headers).toEqual(["S.No.", "Percentage Funded", "Amount Pledged"]);
  });

  test("shows 5 rows per page", async ({ page }) => {
    await page.waitForSelector("tbody tr");
    const rows = await page.$$("tbody tr");
    expect(rows).toHaveLength(5);
  });

  test("pagination works correctly", async ({ page }) => {
    await page.waitForSelector(".pagination");
    const firstPageBtn = page.getByRole("button", { current: "page" });
    await expect(firstPageBtn).toHaveText("1");

    await page.getByRole("button", { name: "Next page" }).click();
    await expect(page.getByRole("button", { current: "page" })).toHaveText("2");
  });

  test("displays formatted currency values", async ({ page }) => {
    await page.waitForSelector("tbody tr");
    const amountCell = await page.$eval(
      "tbody tr:first-child td:last-child",
      (el) => el.textContent
    );
    expect(amountCell).toMatch(/^\$\d{1,3}(,\d{3})*$/);
  });

  test("mock API failure shows error", async ({ page }) => {
    await page.route("**/frontend-assignment.json", (route) =>
      route.fulfill({ status: 500 })
    );
    await page.reload();
    await expect(page.getByRole("alert")).toBeVisible();
  });
});
