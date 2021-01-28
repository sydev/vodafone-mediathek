import { signIn, signOut, useSession } from 'next-auth/client';

import Header from 'components/Header';

const Home = () => {
  const [ session, loading ] = useSession();

  return <>
    <Header />
    {!session && <>
      Not signed in <br/>
      <button onClick={() => signIn()}>Sign in</button>
    </>}
    {session && <>
      Signed in as {session.user.email} <br/>
      <button onClick={() => signOut()}>Sign out</button>
    </>}
  </>
}

export default Home;
