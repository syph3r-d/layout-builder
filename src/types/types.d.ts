interface LayoutComponent {
  id: string;
  height: number;
  setHeight?: (height: number) => void;
}

interface ComponentInstance {
  id: string;
  component: React.ReactNode;
  type: string;
  width: number;
  sectionId: string;
  order: number;
}
