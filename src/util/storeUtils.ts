import { ISaveable } from '@/classes/components';
import { deleteDataById, saveDelta } from '@/io/Data';
import _ from 'lodash';

interface StoreTree {
  [key: string]: any;
  getters?: any;
  actions?: any;
  mutations?: any;
  state?: any;
}

const getModule = (module: StoreTree) => {
  const keys = ['getters', 'actions', 'mutations', 'state'];
  const ret = {};
  keys.forEach((key) => {
    if (module[key]) {
      Object.keys(module[key]).forEach((k) => {
        ret[k] = module[key][k];
      });
    }
  });
  console.log(ret);
  return ret;
};

const storeSaveDelta = async (items: ISaveable[]) => {
  if (items.length) _.debounce(__ssd_internal, 1000)(items);
};

const __ssd_internal = async (items: ISaveable[]) => {
  if (!items.length) return;
  const t = items[0].ItemType.toLowerCase();
  await saveDelta(
    `${t}s`,
    items
      .filter((x) => x.SaveController.IsDirty)
      .map((x) => x.constructor['Serialize'](x))
  );
};

const deletePermanent = async (item: ISaveable) => {
  const t = item.ItemType.toLowerCase();
  console.log(`deleting ${t} permanently: `, item.Name ? item.Name : 'Unknown');
  await deleteDataById(`${t}s`, [item.ID]);
};

export { storeSaveDelta, deletePermanent, getModule };
