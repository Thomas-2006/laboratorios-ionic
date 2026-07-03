import React, { useEffect, useState } from "react";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonModal,
  IonText,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { Repository } from "../interfaces/Repository";
import { RepositoryPayload } from "../interfaces/RepositoryPayload";
import LoadingSpinner from "./LoadingSpinner";

interface EditRepoModalProps {
  isOpen: boolean;
  repository: Repository | null;
  onClose: () => void;
  onSave: (payload: RepositoryPayload) => Promise<void>;
}

// Modal de edición utilizado por el método PATCH para actualizar un repositorio existente.
const EditRepoModal: React.FC<EditRepoModalProps> = ({ isOpen, repository, onClose, onSave }) => {
  const [formData, setFormData] = useState<RepositoryPayload>({ name: "", description: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const [saving, setSaving] = useState(false);

  // Cada vez que se abre el modal con un repositorio distinto, se precargan sus datos actuales.
  useEffect(() => {
    if (repository) {
      setFormData({
        name: repository.name,
        description: repository.description || "",
      });
      setErrorMsg("");
    }
  }, [repository, isOpen]);

  const handleSave = async () => {
    if (formData.name.trim() === "") {
      setErrorMsg("El nombre del repositorio es obligatorio");
      return;
    }
    setSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      setErrorMsg("Error al actualizar repositorio: " + (error as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Editar repositorio</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onClose}>Cerrar</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="form-container">
          <IonInput
            className="form-field"
            label="Nombre del repositorio"
            labelPlacement="floating"
            value={formData.name}
            onIonChange={(e) => setFormData({ ...formData, name: e.detail.value! })}
          />
          <IonTextarea
            className="form-field"
            label="Descripción"
            labelPlacement="floating"
            value={formData.description}
            onIonChange={(e) => setFormData({ ...formData, description: e.detail.value! })}
            rows={5}
          />
          {errorMsg !== "" && (
            <IonText color="danger">
              <p>{errorMsg}</p>
            </IonText>
          )}
          <IonButton className="form-field" expand="block" onClick={handleSave} disabled={saving}>
            Guardar cambios
          </IonButton>
        </div>
        {saving && <LoadingSpinner />}
      </IonContent>
    </IonModal>
  );
};

export default EditRepoModal;
