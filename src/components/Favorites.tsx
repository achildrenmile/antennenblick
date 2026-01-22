import { useState, useEffect } from 'react';
import { useI18n } from '../i18n';
import type { AntennaConfig } from '../data/antennaPatterns';

interface SavedFavorite {
  id: string;
  name: string;
  config: AntennaConfig;
  createdAt: string;
}

interface Props {
  currentConfig: AntennaConfig;
  onLoadConfig: (config: AntennaConfig) => void;
  onClose: () => void;
}

const STORAGE_KEY = 'antennenblick-favorites';

function loadFavorites(): SavedFavorite[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveFavorites(favorites: SavedFavorite[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
}

export function Favorites({ currentConfig, onLoadConfig, onClose }: Props) {
  const { t } = useI18n();
  const [favorites, setFavorites] = useState<SavedFavorite[]>([]);
  const [newName, setNewName] = useState('');
  const [showSaveForm, setShowSaveForm] = useState(false);

  useEffect(() => {
    setFavorites(loadFavorites());
  }, []);

  const handleSave = () => {
    if (!newName.trim()) return;

    const newFavorite: SavedFavorite = {
      id: Date.now().toString(),
      name: newName.trim(),
      config: currentConfig,
      createdAt: new Date().toISOString(),
    };

    const updated = [...favorites, newFavorite];
    setFavorites(updated);
    saveFavorites(updated);
    setNewName('');
    setShowSaveForm(false);
  };

  const handleDelete = (id: string) => {
    const updated = favorites.filter((f) => f.id !== id);
    setFavorites(updated);
    saveFavorites(updated);
  };

  const handleLoad = (config: AntennaConfig) => {
    onLoadConfig(config);
    onClose();
  };

  const getConfigSummary = (config: AntennaConfig) => {
    const antennaName = t.antenna[config.type as keyof typeof t.antenna] || config.type;
    return `${antennaName} | ${config.band} | ${config.height}m`;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="favorites-modal" onClick={(e) => e.stopPropagation()}>
        <div className="favorites-header">
          <h2>{t.favorites?.title || 'Favoriten'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="favorites-content">
          {/* Save current config */}
          <div className="favorites-save-section">
            <h3>{t.favorites?.saveCurrent || 'Aktuelle Konfiguration speichern'}</h3>
            {showSaveForm ? (
              <div className="save-form">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder={t.favorites?.namePlaceholder || 'Name für den Favoriten'}
                  className="favorite-name-input"
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                />
                <div className="save-form-buttons">
                  <button onClick={handleSave} className="save-button">
                    {t.favorites?.save || 'Speichern'}
                  </button>
                  <button onClick={() => setShowSaveForm(false)} className="cancel-button">
                    {t.favorites?.cancel || 'Abbrechen'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="current-config-preview">
                <span className="config-summary">{getConfigSummary(currentConfig)}</span>
                <button onClick={() => setShowSaveForm(true)} className="add-favorite-button">
                  + {t.favorites?.addFavorite || 'Als Favorit speichern'}
                </button>
              </div>
            )}
          </div>

          {/* Saved favorites list */}
          <div className="favorites-list-section">
            <h3>{t.favorites?.savedFavorites || 'Gespeicherte Favoriten'}</h3>
            {favorites.length === 0 ? (
              <p className="no-favorites">{t.favorites?.noFavorites || 'Keine Favoriten gespeichert'}</p>
            ) : (
              <div className="favorites-list">
                {favorites.map((fav) => (
                  <div key={fav.id} className="favorite-item">
                    <div className="favorite-info">
                      <span className="favorite-name">{fav.name}</span>
                      <span className="favorite-config">{getConfigSummary(fav.config)}</span>
                      <span className="favorite-date">
                        {new Date(fav.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="favorite-actions">
                      <button
                        onClick={() => handleLoad(fav.config)}
                        className="load-button"
                        title={t.favorites?.load || 'Laden'}
                      >
                        {t.favorites?.load || 'Laden'}
                      </button>
                      <button
                        onClick={() => handleDelete(fav.id)}
                        className="delete-button"
                        title={t.favorites?.delete || 'Löschen'}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="favorites-footer">
          <p className="favorites-hint">
            {t.favorites?.hint || 'Favoriten werden lokal in Ihrem Browser gespeichert.'}
          </p>
        </div>
      </div>
    </div>
  );
}
