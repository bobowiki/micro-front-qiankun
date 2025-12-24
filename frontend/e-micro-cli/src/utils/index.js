// const path = require('path');
// const fs = require('fs');
import path from 'node:path';
import fs from 'node:fs';

function getPackageJson() {
    const pkgPath = path.join(process.cwd(), 'package.json');
    if (fs.existsSync(pkgPath)) {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
        return pkg
    }
    return null;
}
export { getPackageJson };
