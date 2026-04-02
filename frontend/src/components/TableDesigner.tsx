import { useState } from 'react';
import { AddIcon, DeleteIcon, EditIcon, FileCopyIcon } from './Icons';
import { useFeedback } from '../context/FeedbackContext';
import type { Project } from '../types';
import './TableDesigner.css';

interface Field {
  id: string;
  name: string;
  type: string;
  required: boolean;
  unique: boolean;
}

interface TableDesignerProps {
  project: Project;
  onTableAdded: (project: Project) => void;
}

export default function TableDesigner({ project, onTableAdded }: TableDesignerProps) {
  const [tableName, setTableName] = useState('');
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'schema' | 'crud'>('schema');
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [editingFieldData, setEditingFieldData] = useState<Partial<Field>>({});
  const [savingFieldId, setSavingFieldId] = useState<string | null>(null);
  const [deletingFieldId, setDeletingFieldId] = useState<string | null>(null);
  const [downloadingBackend, setDownloadingBackend] = useState(false);
  const { showSuccess, showError } = useFeedback();

  const addField = () => {
    setFields([
      ...fields,
      {
        id: Date.now().toString(),
        name: '',
        type: 'String',
        required: true,
        unique: false,
      },
    ]);
  };

  const removeField = (id: string) => {
    setFields(fields.filter((f) => f.id !== id));
  };

  const updateField = (id: string, key: keyof Field, value: any) => {
    setFields(
      fields.map((f) => (f.id === id ? { ...f, [key]: value } : f))
    );
  };

  const handleEditField = (_tableId: string, field: Field) => {
    setEditingFieldId(field.id);
    setEditingFieldData({
      id: field.id,
      name: field.name,
      type: field.type || 'String',
      required: field.required !== false ? true : false,
    });
  };

  const handleSaveFieldEdit = async (projectId: string, tableId: string, fieldId: string) => {
    if (!editingFieldData.name?.trim()) {
      showError('Field name cannot be empty');
      return;
    }

    try {
      setSavingFieldId(fieldId);
      const res = await fetch(
        `http://localhost:5000/api/projects/${projectId}/tables/${tableId}/fields/${fieldId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: editingFieldData.name?.trim(),
            type: editingFieldData.type || 'String',
            required: editingFieldData.required ?? true,
          }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        showError(errorData.message || `Server error (${res.status})`);
        return;
      }

      const data = await res.json();

      if (data.success) {
        showSuccess(data.message || 'Field updated successfully');
        onTableAdded(data.data.project);
        setEditingFieldId(null);
        setEditingFieldData({});
      } else {
        showError(data.message || 'Failed to update field');
      }
    } catch (err: any) {
      showError(err.message || 'Connection error');
    } finally {
      setSavingFieldId(null);
    }
  };

  const handleDeleteField = async (projectId: string, tableId: string, fieldId: string, fieldName: string) => {
    if (!window.confirm(`Delete field "${fieldName}"? This cannot be undone.`)) {
      return;
    }

    try {
      setDeletingFieldId(fieldId);
      const res = await fetch(
        `http://localhost:5000/api/projects/${projectId}/tables/${tableId}/fields/${fieldId}`,
        {
          method: 'DELETE',
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        showError(errorData.message || `Server error (${res.status})`);
        return;
      }

      const data = await res.json();

      if (data.success) {
        showSuccess(data.message || 'Field deleted successfully');
        onTableAdded(data.data.project);
      } else {
        showError(data.message || 'Failed to delete field');
      }
    } catch (err: any) {
      showError(err.message || 'Connection error');
    } finally {
      setDeletingFieldId(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showSuccess('Copied to clipboard');
  };

  const downloadBackend = async () => {
    try {
      setDownloadingBackend(true);
      const response = await fetch('http://localhost:5000/api/export-backend');
      
      if (!response.ok) {
        showError('Failed to download backend. Make sure all tables are created first.');
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `visual-api-orchestrator-backend-${Date.now()}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      showSuccess('Backend downloaded successfully! Extract and run: npm install && npm run dev');
    } catch (error) {
      console.error('Download error:', error);
      showError('Failed to download backend. Check console for details.');
    } finally {
      setDownloadingBackend(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!tableName.trim()) {
      showError('Table name is required');
      return;
    }

    if (fields.length === 0) {
      showError('Add at least one field');
      return;
    }

    const invalidField = fields.find((f) => !f.name.trim());
    if (invalidField) {
      showError('All field names are required');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/projects/${project.id}/tables`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: tableName,
          fields: fields.map(({ id, ...f }) => f),
        }),
      });

      const data = await res.json();

      if (!data.success) {
        showError(data.message || 'Failed to create table');
        return;
      }

      showSuccess(data.message || 'Table created successfully');
      setResponse(data.data);
      setActiveTab('schema');
      
      const projectRes = await fetch(`http://localhost:5000/api/projects/${project.id}`);
      const projectData = await projectRes.json();
      if (projectData.success) {
        onTableAdded(projectData.data);
      }

      setTableName('');
      setFields([]);
    } catch (err: any) {
      showError(err.message || 'Connection error. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="designer-container">
      <div className="project-info">
        <h2>Project: {project.name}</h2>
        {project.tables.length > 0 && (
          <div className="tables-summary">
            <span>{project.tables.length} table{project.tables.length !== 1 ? 's' : ''}</span>
          </div>
        )}
      </div>

      {project.tables.length > 0 && (
        <div className="existing-tables">
          <h3>Tables in this project</h3>
          <div className="tables-grid">
            {project.tables.map((table) => (
              <div key={table.id} className="table-card">
                <div className="table-card-name">{table.name}</div>
                <div className="table-card-fields">
                  {table.fields.map((field) => (
                    <div key={field.id} className="field-badge">
                      {editingFieldId === field.id ? (
                        <div className="field-edit">
                          <input
                            type="text"
                            value={editingFieldData.name || ''}
                            onChange={(e) => setEditingFieldData({ ...editingFieldData, name: e.target.value })}
                            autoFocus
                          />
                          <select
                            value={editingFieldData.type || field.type}
                            onChange={(e) => setEditingFieldData({ ...editingFieldData, type: e.target.value })}
                          >
                            <option value="String">String</option>
                            <option value="Int">Int</option>
                            <option value="Boolean">Boolean</option>
                            <option value="Float">Float</option>
                            <option value="DateTime">DateTime</option>
                          </select>
                          <button
                            className="save-btn"
                            onClick={() => handleSaveFieldEdit(project.id, table.id, field.id)}
                          >
                            Save
                          </button>
                          <button
                            className="cancel-btn"
                            onClick={() => setEditingFieldId(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className="field-info">
                            {field.name}: <span className="field-type">{field.type}</span>
                          </span>
                          <div className="field-actions">
                            <button
                              className="edit-btn"
                              onClick={() => handleEditField(table.id, field)}
                              title="Edit field"
                              disabled={savingFieldId === field.id || deletingFieldId === field.id}
                            >
                              <EditIcon />
                            </button>
                            <button
                              className="delete-btn"
                              onClick={() => handleDeleteField(project.id, table.id, field.id, field.name)}
                              title="Delete field"
                              disabled={deletingFieldId === field.id}
                            >
                              <DeleteIcon />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="designer-form">
        <h3>Create New Table</h3>

        <div className="form-group">
          <label>Table Name</label>
          <input
            type="text"
            value={tableName}
            onChange={(e) => setTableName(e.target.value)}
            placeholder="e.g., users, products"
          />
        </div>

        <fieldset className="fields-section">
          <legend>Fields</legend>
          {fields.length === 0 ? (
            <p className="empty">No fields yet. Click "Add Field" to start.</p>
          ) : (
            <div className="fields-list">
              {fields.map((field) => (
                <div key={field.id} className="field-row">
                  <input
                    type="text"
                    placeholder="Field name"
                    value={field.name}
                    onChange={(e) =>
                      updateField(field.id, 'name', e.target.value)
                    }
                  />
                  <select
                    value={field.type}
                    onChange={(e) =>
                      updateField(field.id, 'type', e.target.value)
                    }
                  >
                    <option value="String">String</option>
                    <option value="Int">Int</option>
                    <option value="Boolean">Boolean</option>
                    <option value="Float">Float</option>
                    <option value="DateTime">DateTime</option>
                  </select>
                  <label className="checkbox">
                    <input
                      type="checkbox"
                      checked={field.required}
                      onChange={(e) =>
                        updateField(field.id, 'required', e.target.checked)
                      }
                    />
                    Required
                  </label>
                  <label className="checkbox">
                    <input
                      type="checkbox"
                      checked={field.unique}
                      onChange={(e) =>
                        updateField(field.id, 'unique', e.target.checked)
                      }
                    />
                    Unique
                  </label>
                  <button
                    type="button"
                    onClick={() => removeField(field.id)}
                    className="btn-remove"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          <button type="button" onClick={addField} className="btn-secondary">
            <AddIcon /> Add Field
          </button>
        </fieldset>

        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Creating...' : 'Create Table & Generate API'}
        </button>
      </form>

      {response && (
        <div className="response-panel">
          <h3>
            {response.tableStatus === 'already_exists' ? '[Warning] Table Already Exists' : '[Success] Table Created Successfully'}
          </h3>
          <div className="response-item">
            <strong>Table:</strong> <code>{response.name}</code>
            {response.tableStatus && (
              <span
                className={`status-badge ${response.tableStatus}`}
                title={response.dbSyncMessage}
              >
                {response.tableStatus === 'created' ? '[OK] Created' : '[Warning] Already Exists'}
              </span>
            )}
          </div>
          {response.dbSyncStatus && (
            <span
              className={`sync-badge ${response.dbSyncStatus}`}
              title={response.dbSyncMessage}
            >
              {response.dbSyncStatus === 'success' ? '[OK] Synced' : '[Error] Sync Failed'}
            </span>
          )}
          {response.dbSyncMessage && (
            <div className="sync-message">
              {response.dbSyncMessage}
            </div>
          )}

          <div className="tabs">
            <button
              className={`tab ${activeTab === 'schema' ? 'active' : ''}`}
              onClick={() => setActiveTab('schema')}
            >
              Prisma Schema
            </button>
            <button
              className={`tab ${activeTab === 'crud' ? 'active' : ''}`}
              onClick={() => setActiveTab('crud')}
            >
              CRUD Routes
            </button>
          </div>

          {activeTab === 'schema' && (
            <div className="code-block">
              <div className="code-header">
                <span>schema.prisma</span>
                <button
                  onClick={() => copyToClipboard(response.prismaCode)}
                  className="btn-copy"
                >
                  <FileCopyIcon /> Copy
                </button>
              </div>
              <pre>{response.prismaCode}</pre>
            </div>
          )}

          {activeTab === 'crud' && (
            <div className="code-block">
              <div className="code-header">
                <span>routes.ts</span>
                <button
                  onClick={() => copyToClipboard(response.crudCode)}
                  className="btn-copy"
                >
                  <FileCopyIcon /> Copy
                </button>
              </div>
              <pre>{response.crudCode}</pre>
            </div>
          )}

          <div className="button-group">
            <button
              onClick={() => setResponse(null)}
              className="btn-secondary"
            >
              Create Another Table
            </button>
            <button
              onClick={downloadBackend}
              className="btn-download"
              disabled={downloadingBackend}
            >
              {downloadingBackend ? 'Downloading...' : '⬇ Download Backend'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
