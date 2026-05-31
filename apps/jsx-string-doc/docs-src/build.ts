import { build } from '@cjean-fr/docs';
import config from '../docs.config.js';

const result = await build(config);
console.log(`Built ${result.pages.length} pages.`);
if (result.searchBuilt) console.log('  ✓ search index');
