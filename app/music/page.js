import CustomerCatalog from '../../components/CustomerCatalog';
import {songs} from '../../data/songs';
export const metadata={title:'Royal Chaos — The album'};
export default function Page(){return <CustomerCatalog songs={songs}/>;}
