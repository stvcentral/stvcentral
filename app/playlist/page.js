import CardPlaylist from '../../components/CardPlaylist';
import {songs} from '../../data/songs';
import './playlist.css';
export const metadata={title:'Playlist de cartes',description:'Scanne les QR de tes cartes Royal Chaos et compose ta playlist.'};
export default function Page(){return <CardPlaylist songs={songs.map(({slug,title,cardName,artwork})=>({slug,title,cardName,artwork}))}/>;}
