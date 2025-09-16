
import WelcomeClient from './client';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const WelcomePage = () => {
    return (
        <>
            <Header />
            <main>
                <WelcomeClient />
            </main>
            <Footer />
        </>
    );
}

export default WelcomePage;
