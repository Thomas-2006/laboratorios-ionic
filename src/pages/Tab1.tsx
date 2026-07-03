import { IonContent, IonHeader, IonList, IonPage, IonText, IonTitle, IonToolbar, useIonViewWillEnter } from '@ionic/react';
import './Tab1.css';
import { fetchRepositories } from '../services/GithubService';
import RepoItem from '../components/RepoItem';
import React from 'react';
import { Repository } from '../interfaces/Repository';
import LoadingSpinner from '../components/LoadingSpinner';

const Tab1: React.FC = () => {
  const [repositoryList, setRepositoryList] = React.useState<Repository[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [errorMsg, setErrorMsg] = React.useState("");

  const loadRepos = async () => {
    setLoading(true);
    fetchRepositories().then((reposData) => {
      setRepositoryList(reposData);
    }).catch((error) => {
      console.log("Error al cargar repositorios", error);
      setErrorMsg("Error al cargar repositorios: " + error);
    }).finally(() => {
      setLoading(false);
    });
  };

  useIonViewWillEnter(() => {
    loadRepos();
  });

  // Actualización dinámica: al eliminar (DELETE) un repositorio, se quita
  // directamente del estado local sin volver a llamar a la API.
  const handleRepoDeleted = (id: number) => {
    setRepositoryList((prevList) => prevList.filter((repo) => repo.id !== id));
  };

  // Actualización dinámica: al editar (PATCH) un repositorio, se reemplaza
  // solo ese elemento dentro del estado local con los datos actualizados.
  const handleRepoUpdated = (updatedRepo: Repository) => {
    setRepositoryList((prevList) =>
      prevList.map((repo) => (repo.id === updatedRepo.id ? updatedRepo : repo))
    );
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar slot='bottom'>
          <IonTitle>Repositorios</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Repositorios</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList>
          {repositoryList.map((repo)=> (
            <RepoItem
              {...repo}
              key={repo.id}
              onDeleted={handleRepoDeleted}
              onUpdated={handleRepoUpdated}
            />
          )
          )}
        </IonList>
        {loading && <LoadingSpinner />}
        {errorMsg !== "" && (
          (<IonText color="danger">
            <p>{errorMsg}</p>
          </IonText>)
        )}
      </IonContent>
    </IonPage>
  );
};

export default Tab1;