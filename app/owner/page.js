import OwnerClaims from '../../components/OwnerClaims';
import {songs} from '../../data/songs';
export const metadata={title:'Owner — claim codes',robots:{index:false,follow:false}};
export default function Page(){return <OwnerClaims songs={songs}/>;}
