import * as THREE from 'three';
import { downloadSTL, geometryToSTLBlob } from './stlExport';

describe('downloadSTL', () => {
  it('creates an object URL, triggers a download, and revokes it', () => {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    geometry.computeVertexNormals();

    const createObjectURL = vi.fn().mockReturnValue('blob:fake-url');
    const revokeObjectURL = vi.fn();
    vi.stubGlobal('URL', { ...URL, createObjectURL, revokeObjectURL });

    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    downloadSTL(geometry, 'test.stl');

    expect(createObjectURL).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:fake-url');

    clickSpy.mockRestore();
    vi.unstubAllGlobals();
  });
});

describe('geometryToSTLBlob', () => {
  it('produces a binary STL blob of the expected size for a simple geometry', () => {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    geometry.computeVertexNormals();

    const triangleCount = (geometry.getIndex()?.count ?? geometry.getAttribute('position').count) / 3;
    const blob = geometryToSTLBlob(geometry);

    expect(blob.type).toBe('application/octet-stream');
    expect(blob.size).toBe(84 + triangleCount * 50);
  });

  it('produces a binary STL blob for a non-indexed geometry', () => {
    const geometry = new THREE.BoxGeometry(1, 1, 1).toNonIndexed();
    geometry.computeVertexNormals();

    const triangleCount = geometry.getAttribute('position').count / 3;
    const blob = geometryToSTLBlob(geometry);

    expect(geometry.getIndex()).toBeNull();
    expect(blob.size).toBe(84 + triangleCount * 50);
  });
});
