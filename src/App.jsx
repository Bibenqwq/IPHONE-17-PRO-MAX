import { useLenis } from './hooks/useLenis';
import Loader from './components/Loader';
import TopBar from './components/TopBar';
import ProgressTracker from './components/ProgressTracker';
import HeroSection from './components/HeroSection';
import ZoomSection from './components/ZoomSection';
import HorizontalSection from './components/HorizontalSection';
import ClosingSection from './components/ClosingSection';

export default function App() {
  useLenis();

  return (
    <>
      <Loader />
      <TopBar />
      <ProgressTracker />
      <HeroSection />
      <ZoomSection />
      <HorizontalSection />
      <ClosingSection />
    </>
  );
}
