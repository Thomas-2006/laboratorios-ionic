import { IonButton, IonContent, IonHeader, IonInput, IonPage, IonText, IonTextarea, IonTitle, IonToolbar, useIonViewWillEnter } from '@ionic/react';
import './Tab2.css';
import { useHistory } from 'react-router';
import { useState } from 'react';
import { RepositoryPayload } from '../interfaces/RepositoryPayload';
import { createRepository } from '../services/GithubService';
import { save } from 'ionicons/icons';
import LoadingSpinner from '../components/LoadingSpinner';

const Tab2: React.FC = () => {
  const history = useHistory();
  const [repositoryData, setRepositoryData] = useState<RepositoryPayload>({
    name: "",
    description: ""
  });
  const [errorMsg, setErrorMsg] = useState("")
  const [loading, setLoading] = useState(false);

  const saveRepo = () =>{
    if (repositoryData.name.trim() === '') {
      setErrorMsg("El nombre del repositorio es obligatorio");
      return; 
    }
    setLoading(true)
    createRepository(repositoryData)
    .then(() => {
      setRepositoryData({
        name: "",
        description: ""
      })
      history.push("/tab1")
    }).catch((error) => setErrorMsg("Error al crear repositorio " + error))
    .finally(() => setLoading(false));
  }

  useIonViewWillEnter ( () => {
    setErrorMsg("");
  });
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Formulario de repositorio</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Formulario de repositorio</IonTitle>
          </IonToolbar>
        </IonHeader>

        <div className='form-container'>
          <IonInput
            className="form-field"
            label='Nombre del repositorio'
            labelPlacement='floating'
            value={repositoryData.name}
            onIonChange={(e) => setRepositoryData({...repositoryData, name: e.detail.value!})}
            placeholder='Ingrese el nombre del repositorio'
          />
          <IonTextarea
            className='form-field'
            label='Descripción del repositorio'
            labelPlacement='floating'
            placeholder='Ingrese la descripción del repositorio'
            value={repositoryData.description}
            onIonChange={(e) => setRepositoryData({...repositoryData, description: e.detail.value!})}
            rows={6}
          />
          {errorMsg != "" && <IonText color="danger">{errorMsg}</IonText>}
          <IonButton
            className='form-field'
            expand='block'
            color='primary'
            onClick={saveRepo}
          >
            Guardar
          </IonButton>
        </div>
        {loading && <LoadingSpinner />}
        
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
