import Qrscanner from '@/components/Qrscanner';
import Link from 'next/link';

const Home = () => {
  return (
    <div>
      <h1>QR Code Scanner</h1>
      <Qrscanner />
      <div className="project-github">
      <p>This project is in </p>
      <Link href="https://github.com/diegoperea20/Qr-Scanner">
        <img width="96" height="96" src="https://img.icons8.com/fluency/96/github.png" alt="github"/>
      </Link>
    </div>
    </div>
  );
};

export default Home;
