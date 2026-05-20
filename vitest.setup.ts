import { vi } from 'vitest';

HTMLCanvasElement.prototype.getContext = () => null;

vi.spyOn(console, 'log').mockImplementation(() => {});
vi.spyOn(console, 'error').mockImplementation(() => {});