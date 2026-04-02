import { useState } from 'react';
import { AddIcon, DeleteIcon, EditIcon, ExpandMoreIcon, ChevronRightIcon } from './Icons';
import { useFeedback } from '../context/FeedbackContext';
import type { Project } from '../types';
import './ProjectManager.css';

interface ProjectManagerProps {
  projects: Project[];
  currentProjectId: string | null;
  onProjectSelect: (projectId: string) => void;
  onProjectCreated: (project: Project) => void;
  onProjectDeleted: (projectId: string) => void;
  onProjectUpdated: (project: Project) => void;
  isLoading: boolean;
}

export default function ProjectManager({
  projects,
  currentProjectId,
  onProjectSelect,
  onProjectCreated,
  onProjectDeleted,
  onProjectUpdated,
  isLoading,
}: ProjectManagerProps) {
  const [newProjectName, setNewProjectName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());
  const [editingTableId, setEditingTableId] = useState<string | null>(null);
  const [editingTableName, setEditingTableName] = useState('');
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);
  const [savingTableId, setSavingTableId] = useState<string | null>(null);
  const [deletingTableId, setDeletingTableId] = useState<string | null>(null);
  const { showSuccess, showError } = useFeedback();

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newProjectName.trim()) {
      showError('Project name is required');
      return;
    }

    try {
      setIsCreating(true);
      const res = await fetch('http://localhost:5000/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newProjectName.trim() }),
      });

      const data = await res.json();

      if (!data.success) {
        showError(data.message || 'Failed to create project');
        return;
      }

      showSuccess(data.message || 'Project created successfully');
      onProjectCreated(data.data);
      setNewProjectName('');
    } catch (err: any) {
      showError(err.message || 'Connection error');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!window.confirm('Delete this project and all its tables? This cannot be undone.')) {
      return;
    }

    try {
      setDeletingProjectId(projectId);
      const res = await fetch(`http://localhost:5000/api/projects/${projectId}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (data.success) {
        showSuccess(data.message || 'Project deleted successfully');
        onProjectDeleted(projectId);
      } else {
        showError(data.message || 'Failed to delete project');
      }
    } catch (err: any) {
      showError(err.message || 'Connection error');
    } finally {
      setDeletingProjectId(null);
    }
  };

  const toggleProjectExpand = (projectId: string) => {
    const newExpanded = new Set(expandedProjects);
    if (newExpanded.has(projectId)) {
      newExpanded.delete(projectId);
    } else {
      newExpanded.add(projectId);
    }
    setExpandedProjects(newExpanded);
  };

  const handleEditTable = (tableId: string, currentName: string) => {
    setEditingTableId(tableId);
    setEditingTableName(currentName);
  };

  const handleSaveTableEdit = async (projectId: string, tableId: string) => {
    if (!editingTableName.trim()) {
      showError('Table name cannot be empty');
      return;
    }

    try {
      setSavingTableId(tableId);
      const res = await fetch(`http://localhost:5000/api/projects/${projectId}/tables/${tableId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editingTableName.trim() }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        showError(errorData.message || `Server error (${res.status})`);
        return;
      }

      const data = await res.json();

      if (data.success) {
        showSuccess(data.message || 'Table updated successfully');
        onProjectUpdated(data.data.project);
        setEditingTableId(null);
        setEditingTableName('');
      } else {
        showError(data.message || 'Failed to update table');
      }
    } catch (err: any) {
      showError(err.message || 'Connection error');
    } finally {
      setSavingTableId(null);
    }
  };

  const handleDeleteTable = async (projectId: string, tableId: string, tableName: string) => {
    if (!window.confirm(`Delete table "${tableName}" and all its fields? This cannot be undone.`)) {
      return;
    }

    try {
      setDeletingTableId(tableId);
      const res = await fetch(`http://localhost:5000/api/projects/${projectId}/tables/${tableId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errorData = await res.json();
        showError(errorData.message || `Server error (${res.status})`);
        return;
      }

      const data = await res.json();

      if (data.success) {
        showSuccess(data.message || 'Table deleted successfully');
        onProjectUpdated(data.data.project);
      } else {
        showError(data.message || 'Failed to delete table');
      }
    } catch (err: any) {
      showError(err.message || 'Connection error');
    } finally {
      setDeletingTableId(null);
    }
  };

  if (isLoading) {
    return <div className="project-manager">Loading projects...</div>;
  }

  return (
    <div className="project-manager">
      <h2>Projects</h2>

      <form onSubmit={handleCreateProject} className="create-project-form">
        <input
          type="text"
          placeholder="New project name..."
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
          disabled={isCreating}
        />
        <button type="submit" disabled={isCreating} className="create-btn">
          <AddIcon />
          {isCreating ? 'Creating...' : 'Create'}
        </button>
      </form>

      <div className="projects-list">
        {projects.length === 0 ? (
          <p className="empty">No projects yet. Create one to get started!</p>
        ) : (
          projects.map((project) => (
            <div
              key={project.id}
              className={`project-item ${currentProjectId === project.id ? 'active' : ''}`}
            >
              <div className="project-header">
                <button
                  className="project-select"
                  onClick={() => onProjectSelect(project.id)}
                >
                  {project.name}
                </button>
                <div className="project-actions">
                  <button
                    className="expand-btn"
                    onClick={() => toggleProjectExpand(project.id)}
                    title="Show tables"
                  >
                    {expandedProjects.has(project.id) ? <ExpandMoreIcon /> : <ChevronRightIcon />}
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteProject(project.id)}
                    title="Delete project"
                    disabled={deletingProjectId === project.id}
                  >
                    <DeleteIcon />
                  </button>
                </div>
              </div>

              {expandedProjects.has(project.id) && project.tables && (
                <div className="project-tables">
                  {project.tables.length === 0 ? (
                    <p className="empty-tables">No tables yet</p>
                  ) : (
                    project.tables.map((table) => (
                      <div key={table.id} className="table-item">
                        {editingTableId === table.id ? (
                          <div className="table-edit">
                            <input
                              type="text"
                              value={editingTableName}
                              onChange={(e) => setEditingTableName(e.target.value)}
                              autoFocus
                            />
                            <button
                              className="save-btn"
                              onClick={() => handleSaveTableEdit(project.id, table.id)}
                            >
                              Save
                            </button>
                            <button
                              className="cancel-btn"
                              onClick={() => setEditingTableId(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="table-info">
                              <span className="table-name">{table.name}</span>
                              <span className="field-count">{table.fields?.length || 0} fields</span>
                            </div>
                            <div className="table-actions">
                              <button
                                className="edit-btn"
                                onClick={() => handleEditTable(table.id, table.name)}
                                title="Edit table"
                                disabled={savingTableId === table.id || deletingTableId === table.id}
                              >
                                <EditIcon />
                              </button>
                              <button
                                className="delete-btn"
                                onClick={() => handleDeleteTable(project.id, table.id, table.name)}
                                title="Delete table"
                                disabled={deletingTableId === table.id}
                              >
                                <DeleteIcon />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
