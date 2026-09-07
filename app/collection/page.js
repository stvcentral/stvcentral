import CustomerCatalog from '../../components/CustomerCatalog';
import { songs } from '../../data/songs';
export const metadata={title:'My collection'};
export default function Page(){return <CustomerCatalog songs={songs} personal/>;}
