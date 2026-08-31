import * as THREE from 'three';
import { geometryToSTLBlob } from './stlExport';

describe('geometryToSTLBlob', () => {
  it('produces a binary STL blob of the expected size for a simple geometry', () => {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    geometry.computeVertexNormals();

    const triangleCount = (geometry.getIndex()?.count ?? geometry.getAttribute('position').count) / 3;
    const blob = geometryToSTLBlob(geometry);

    expect(blob.type).toBe('application/octet-stream');
    expect(blob.size).toBe(84 + triangleCount * 50);
  });
});
