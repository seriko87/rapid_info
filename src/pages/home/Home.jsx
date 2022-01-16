import './home.css';
import { useContext } from 'react';
import Profile from '../../components/profile/Profile';
import { useAuthState } from '../../firebase';
import { GlobalContext } from '../../context/GlobalContext';

function Home() {
  const { list } = useContext(GlobalContext);
  const user = useAuthState();

  return (
    <div className="container">
      <Profile user={user} />
      {list.map((item) => {
        if (item.status) {
          return item.component;
        }
        return null;
      })}
    </div>
  );
}

export default Home;
