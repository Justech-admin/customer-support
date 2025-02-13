import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
   const router = useRouter();

   useEffect(() => {
      router.push('/login');
   }, []);

   return null; // Return null since this page will immediately redirect
}
