import QrScanner from '@/components/QrScanner';
import Link from 'next/link';

const Home = () => {
  return (
    <div>
      <h1>QR Code Scanner</h1>
      <QrScanner />
      <div className="project-github">
      <p>This project is in </p>
      <Link href="https://github.com/diegoperea20">
        <img width="96" height="96" src="https://img.icons8.com/fluency/96/github.png" alt="github"/>
      </Link>
    </div>
    </div>
  );
};

export default Home;
