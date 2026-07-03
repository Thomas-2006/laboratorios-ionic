import { IonCard, IonCardContent, IonCardSubtitle, IonCardTitle, IonContent, IonHeader, IonPage, IonText, IonTitle, IonToolbar, useIonActionSheet, useIonViewDidEnter } from '@ionic/react';
import React, { use } from 'react';
import './Tab3.css';
import { GithubUser } from '../interfaces/GithubUser';
import { fetchUserInfo } from '../services/GithubService';
import LoadingSpinner from '../components/LoadingSpinner';

const Tab3: React.FC = () => {
  const [userInfo, setUserInfo] = React.useState<GithubUser | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");

  useIonViewDidEnter(() => {
    setLoading(true);
    fetchUserInfo().then(user => {
      setUserInfo(user);
    }).catch(error => {
      setErrorMsg("Error al cargar información del usuario: " + error);
    }).finally(() => {
      setLoading(false);
    });
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Perfil de Usuario</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Perfil</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div className="card-contntainer">
          {userInfo && (
            <IonCard className="card">
              <img src={userInfo.avatar_url} alt="Avatar" />
              <IonHeader>
                <IonCardTitle>{userInfo.name}</IonCardTitle>
                <IonCardSubtitle>{userInfo.login}</IonCardSubtitle>
                <IonCardContent>
                <p>Desarrollador de software junior</p>
              </IonCardContent>
            </IonHeader>
          </IonCard>)}
          {errorMsg && <IonText color="danger">{errorMsg}</IonText>}
        </div>
        {loading && <LoadingSpinner />}
      </IonContent>
    </IonPage>
  );
};

export default Tab3;