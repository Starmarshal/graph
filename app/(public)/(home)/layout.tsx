import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Graph Visualizer',
};

export default function HomeLayout({
                                     children,
                                   }: {
  children: React.ReactNode;
}) {
  return children;
}