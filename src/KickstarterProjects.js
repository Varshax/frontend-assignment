import React, { useState, useEffect } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";

const styles = `
  :root {
    --primary: #374151; /* Soft navy */
    --secondary: #F3F4F6; /* Light blue-gray */
    --accent: #10B981; /* Muted teal */
    --text: #1F2937; /* Neutral dark gray */
    --background: #FFFFFF; /* Clean white */
    --border: #E5E7EB; /* Light gray for borders */
    --hover: #E1E7EC; /* Slight hover effect */
    --disabled: #D1D5DB; /* Soft gray for disabled elements */
  }

  .container {
    max-width: 900px;
    margin: 40px auto;
    padding: 20px;
    font-family: 'Roboto', sans-serif;
    background-color: var(--background);
    color: var(--text);
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    text-align: center;
  }

  h1 {
    color: var(--primary);
    margin-bottom: 20px;
    font-size: 24px;
    font-weight: 600;
  }

  table {
    margin: 0 auto;
    width: 100%;
    border-collapse: collapse;
    background: var(--background);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    border-radius: 6px;
    overflow: hidden;
  }

  th, td {
    padding: 12px 16px;
    text-align: left;
    border-bottom: 1px solid var(--border);
  }

  th {
    background-color: var(--secondary);
    color: var(--primary);
    font-weight: 600;
    text-transform: uppercase;
  }

  tr:hover {
    background-color: var(--hover);
  }

  .progress-container {
    display: flex;
    align-items: center;
    gap: 10px;
    background: var(--secondary);
    border-radius: 4px;
    padding: 4px;
  }

  .progress-bar {
    height: 8px;
    background-color: var(--accent);
    border-radius: 4px;
    transition: width 0.3s ease;
  }

  .pagination {
    margin: 20px auto;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    width: fit-content;
  }

  .pagination button {
    padding: 6px 12px;
    border: 1px solid var(--border);
    background: var(--background);
    color: var(--primary);
    cursor: pointer;
    border-radius: 4px;
    font-size: 16px;
    transition: background-color 0.2s ease, color 0.2s ease;
  }

  .pagination button:hover:not(:disabled) {
    background: var(--accent);
    color: var(--background);
  }

  .pagination button:disabled {
    cursor: not-allowed;
    color: var(--disabled);
  }

  .pagination button.active {
    background: var(--primary);
    color: var(--background);
  }

  .loader {
    border: 4px solid var(--border);
    border-top: 4px solid var(--accent);
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 1s linear infinite;
    margin: 40px auto;
  }

  .error, .no-data {
    color: var(--accent);
    text-align: center;
    padding: 20px;
    background: var(--secondary);
    border-radius: 4px;
    font-weight: bold;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const KickstarterTable = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 5;

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(
          "https://raw.githubusercontent.com/saaslabsco/frontend-assignment/refs/heads/master/frontend-assignment.json"
        );
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        setProjects(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = projects.slice(
    indexOfFirstProject,
    indexOfLastProject
  );
  const totalPages = Math.ceil(projects.length / projectsPerPage);

  if (loading) return <div aria-label="Loading" className="loader"></div>;
  if (error)
    return (
      <div role="alert" className="error">
        {error}
      </div>
    );

  return (
    <div className="container">
      <h1>Kickstarter Projects</h1>
      {projects.length > 0 ? (
        <>
          <table role="grid" aria-label="Kickstarter Projects">
            <thead>
              <tr>
                <th scope="col">S.No.</th>
                <th scope="col">Percentage Funded</th>
                <th scope="col">Amount Pledged</th>
              </tr>
            </thead>
            <tbody>
              {currentProjects.map((project) => (
                <tr key={project["s.no"]}>
                  <td>{project["s.no"]}</td>
                  <td>
                    <div className="progress-container">
                      <div
                        className="progress-bar"
                        style={{
                          width: `${Math.min(
                            project["percentage.funded"],
                            100
                          )}%`,
                        }}
                        role="progressbar"
                        aria-valuenow={project["percentage.funded"]}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                      <span>{project["percentage.funded"]}%</span>
                    </div>
                  </td>
                  <td>${project["amt.pledged"].toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {totalPages > 1 && (
            <nav className="pagination" aria-label="Pagination">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Previous page"
              >
                <i className="fas fa-chevron-left"></i>
              </button>

              {currentPage > 3 && <button disabled>...</button>}

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + Math.max(currentPage - 2, 1);
                if (page > totalPages) return null;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={currentPage === page ? "active" : ""}
                    aria-current={currentPage === page ? "page" : undefined}
                  >
                    {page}
                  </button>
                );
              })}

              {currentPage < totalPages - 2 && <button disabled>...</button>}

              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Next page"
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </nav>
          )}
        </>
      ) : (
        <div className="no-data">No projects available to display.</div>
      )}
    </div>
  );
};

const KickstarterProjects = () => {
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
    return () => styleSheet.remove();
  }, []);

  return <KickstarterTable />;
};

export default KickstarterProjects;
