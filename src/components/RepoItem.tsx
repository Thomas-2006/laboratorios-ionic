import React, { useState } from "react";
import { Repository } from "../interfaces/Repository";
import { RepositoryPayload } from "../interfaces/RepositoryPayload";
import {
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonThumbnail,
  useIonAlert,
  useIonToast,
} from "@ionic/react";
import { pencil, trash } from "ionicons/icons";
import { deleteRepository, updateRepository } from "../services/GithubService";
import EditRepoModal from "./EditRepoModal";

interface RepoItemProps extends Repository {
  // Se ejecuta cuando el repositorio fue eliminado (DELETE) para que el padre
  // (Tab1) lo quite de la lista sin necesidad de volver a pedir todos los datos.
  onDeleted: (id: number) => void;
  // Se ejecuta cuando el repositorio fue editado (PATCH) para que el padre
  // (Tab1) actualice ese ítem específico en la lista.
  onUpdated: (repo: Repository) => void;
}

const RepoItem: React.FC<RepoItemProps> = ({ onDeleted, onUpdated, ...repository }) => {
  const [presentAlert] = useIonAlert();
  const [presentToast] = useIonToast();
  const [showEditModal, setShowEditModal] = useState(false);

  // Confirmación de una acción destructiva antes de llamar al método DELETE.
  const handleDeleteClick = () => {
    presentAlert({
      header: "Eliminar repositorio",
      message: `¿Seguro que deseas eliminar "${repository.name}"? Esta acción no se puede deshacer.`,
      buttons: [
        { text: "Cancelar", role: "cancel" },
        {
          text: "Eliminar",
          role: "destructive",
          handler: () => {
            deleteRepository(repository.owner.login, repository.name)
              .then(() => {
                onDeleted(repository.id);
                presentToast({
                  message: "Repositorio eliminado correctamente",
                  duration: 2000,
                  color: "success",
                });
              })
              .catch((error) => {
                presentToast({
                  message: "Error al eliminar repositorio: " + error,
                  duration: 3000,
                  color: "danger",
                });
              });
          },
        },
      ],
    });
  };

  // Llama al método PATCH y, si todo sale bien, notifica al padre para
  // actualizar dinámicamente ese repositorio en la interfaz.
  const handleSaveEdit = async (payload: RepositoryPayload) => {
    const updatedRepo = await updateRepository(repository.owner.login, repository.name, payload);
    onUpdated(updatedRepo);
    presentToast({
      message: "Repositorio actualizado correctamente",
      duration: 2000,
      color: "success",
    });
  };

  return (
    <>
      <IonItemSliding>
        <IonItem>
          <IonThumbnail slot="start">
            <img
              src={repository.owner.avatar_url}
              alt={repository.name}
            />
          </IonThumbnail>

          <IonLabel>
            <h3>{repository.name}</h3>
            { repository.description && (
            <p>{repository.description}</p>
            )}
            { repository.language && (
            <p>
              <strong>Lenguaje:</strong> {repository.language}
            </p>
            )}
          </IonLabel>
          </IonItem>

            <IonItemOptions>
              <IonItemOption onClick={() => setShowEditModal(true)}>
                <IonIcon icon={pencil} slot="icon-only" />
              </IonItemOption>

              <IonItemOption color="danger" onClick={handleDeleteClick}>
                <IonIcon icon={trash} slot="icon-only" />
              </IonItemOption>
            </IonItemOptions>
      </IonItemSliding>

      <EditRepoModal
        isOpen={showEditModal}
        repository={repository}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveEdit}
      />
    </>
  );
}
 export default RepoItem
