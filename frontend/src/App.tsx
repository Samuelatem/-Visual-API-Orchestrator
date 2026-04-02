import './App.css';
import { useState, useEffect } from 'react';
import type { Project } from './types';
import TableDesigner from './components/TableDesigner';
import ProjectManager from './components/ProjectManager';
import FeedbackBar from './components/FeedbackBar';
import ThemeToggle from './components/ThemeToggle';
import { FeedbackProvider } from './context/FeedbackContext';
import { useTheme } from './hooks/useTheme';

function App() {
  useTheme(); // Initialize theme from localStorage and system preference
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [loadingProjects, setLoadingProjects] = useState(true);

  // Load projects on mount
  useEffect(() => {
    loadProjects();
  }, []);

  // Load project details when current project ID changes
  useEffect(() => {
    if (currentProjectId) {
      loadProjectDetails(currentProjectId);
      localStorage.setItem('currentProjectId', currentProjectId);
    } else {
      localStorage.removeItem('currentProjectId');
      setCurrentProject(null);
    }
  }, [currentProjectId]);

  const loadProjects = async () => {
    try {
      setLoadingProjects(true);
      const res = await fetch('http://localhost:5000/api/projects');
      const data = await res.json();
      
      if (data.success) {
        setProjects(data.data);
        // Restore last selected project if available
        const lastProjectId = localStorage.getItem('currentProjectId');
        if (lastProjectId && data.data.some((p: Project) => p.id === lastProjectId)) {
          setCurrentProjectId(lastProjectId);
        }
      }
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoadingProjects(false);
    }
  };

  const loadProjectDetails = async (projectId: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/projects/${projectId}`);
      const data = await res.json();
      
      if (data.success) {
        setCurrentProject(data.data);
      }
    } catch (error) {
      console.error('Failed to load project details:', error);
    }
  };

  const handleProjectCreated = (newProject: Project) => {
    setProjects([newProject, ...projects]);
    setCurrentProjectId(newProject.id);
  };

  const handleProjectDeleted = (projectId: string) => {
    setProjects(projects.filter(p => p.id !== projectId));
    if (currentProjectId === projectId) {
      setCurrentProjectId(null);
    }
  };

  const handleTableAdded = (updatedProject: Project) => {
    setCurrentProject(updatedProject);
    setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
  };

  const handleProjectUpdated = (updatedProject: Project) => {
    setCurrentProject(updatedProject);
    setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
  };

  return (
    <FeedbackProvider>
      <FeedbackBar />
      <div className="app-container">
        <header>
          <div className="header-content">
            <div>
              <h1>Visual API Orchestrator</h1>
              <p>Create tables visually, generate APIs automatically</p>
            </div>
            <ThemeToggle />
          </div>
        </header>
        <main>
          <div className="app-layout">
            <div className="project-panel">
              <ProjectManager
                projects={projects}
                currentProjectId={currentProjectId}
                onProjectSelect={setCurrentProjectId}
                onProjectCreated={handleProjectCreated}
                onProjectDeleted={handleProjectDeleted}
                onProjectUpdated={handleProjectUpdated}
                isLoading={loadingProjects}
              />
            </div>
            <div className="designer-panel">
              {currentProject ? (
                <TableDesigner
                  project={currentProject}
                  onTableAdded={handleTableAdded}
                />
              ) : (
                <div className="empty-state">
                  <p>Select a project from the left panel to get started</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </FeedbackProvider>
  );
}

export default App;
