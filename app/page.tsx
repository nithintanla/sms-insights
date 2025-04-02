import { redirect } from 'next/navigation';
import Image from "next/image";

export default function Home() {
  redirect('/dashboard');
  
  // This won't be rendered, but is required for the component
  return null;
}
