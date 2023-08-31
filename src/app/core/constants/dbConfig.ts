import { DBConfig } from 'ngx-indexed-db';
import { environment } from 'src/environments/environment';

export const DbConfig: DBConfig = {
    name: environment.app_name,
    version: 4,
    objectStoresMeta: [{
      store: 'forms',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'id', keypath: 'id', options: { unique: true } },
        { name: 'controls', keypath: 'controls', options: { unique: false } }
      ]
    }],
  };