/**
 * IndexedDB 封装
 */

export function openDB(dbName: string, storeName: string, version = 1): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const indexedDB = window.indexedDB
    let db: IDBDatabase
    const request = indexedDB.open(dbName, version)

    request.onsuccess = function (event) {
      db = (event.target as IDBOpenDBRequest).result
      resolve(db)
    }

    request.onerror = function () {
      reject(new Error(`Failed to open database "${dbName}"`))
    }

    request.onupgradeneeded = function (event) {
      console.log('onupgradeneeded')
      db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(storeName)) {
        const objectStore = db.createObjectStore(storeName, { keyPath: 'uuid' })
        console.log(objectStore, 'objectStore')
      }
    }
  })
}

/**
 * 新增数据
 */
export function addData(db: IDBDatabase, storeName: string, data: any): Promise<Event> {
  return new Promise((resolve, reject) => {
    const request = db
      .transaction([storeName], 'readwrite')
      .objectStore(storeName)
      .add(data)

    request.onsuccess = function (event) {
      resolve(event)
    }

    request.onerror = function (event) {
      const errorMsg = (event.target as IDBRequest).error?.message || 'Failed to add data'
      reject(new Error(errorMsg))
    }
  })
}

/**
 * 通过主键读取数据
 */
export function getDataByKey(db: IDBDatabase, storeName: string, key: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName])
    const objectStore = transaction.objectStore(storeName)
    const request = objectStore.get(key)

    request.onerror = function () {
      reject(new Error(`Failed to get data by key "${key}"`))
    }

    request.onsuccess = function () {
      resolve(request.result)
    }
  })
}

/**
 * 通过游标读取数据
 */
export function cursorGetData(db: IDBDatabase, storeName: string): Promise<any[]> {
  const list: any[] = []
  const store = db
    .transaction(storeName, 'readwrite')
    .objectStore(storeName)
  const request = store.openCursor()

  return new Promise((resolve, reject) => {
    request.onsuccess = function (e) {
      const cursor = (e.target as IDBRequest).result
      if (cursor) {
        list.push(cursor.value)
        cursor.continue()
      }
      else {
        resolve(list)
      }
    }
    request.onerror = function () {
      reject(new Error('Failed to read data by cursor'))
    }
  })
}

/**
 * 通过索引读取数据
 */
export function getDataByIndex(
  db: IDBDatabase,
  storeName: string,
  indexName: string,
  indexValue: string,
): Promise<any> {
  const store = db.transaction(storeName, 'readwrite').objectStore(storeName)
  const request = store.index(indexName).get(indexValue)

  return new Promise((resolve, reject) => {
    request.onerror = function () {
      reject(new Error(`Failed to get data by index "${indexName}"`))
    }
    request.onsuccess = function (e) {
      resolve((e.target as IDBRequest).result)
    }
  })
}

/**
 * 通过索引和游标查询记录
 */
export function cursorGetDataByIndex(
  db: IDBDatabase,
  storeName: string,
  indexName: string,
  indexValue: string,
): Promise<any[]> {
  const list: any[] = []
  const store = db.transaction(storeName, 'readwrite').objectStore(storeName)
  const request = store
    .index(indexName)
    .openCursor(IDBKeyRange.only(indexValue))

  return new Promise((resolve, reject) => {
    request.onsuccess = function (e) {
      const cursor = (e.target as IDBRequest).result
      if (cursor) {
        list.push(cursor.value)
        cursor.continue()
      }
      else {
        resolve(list)
      }
    }
    request.onerror = function () {
      reject(new Error(`Failed to get data by index "${indexName}" with cursor`))
    }
  })
}

/**
 * 更新数据
 */
export function updateDB(db: IDBDatabase, storeName: string, data: any): Promise<Event> {
  const request = db
    .transaction([storeName], 'readwrite')
    .objectStore(storeName)
    .put(data)

  return new Promise((resolve) => {
    request.onsuccess = function (ev) {
      resolve(ev)
    }

    request.onerror = function (ev) {
      resolve(ev)
    }
  })
}

/**
 * 删除数据
 */
export function deleteDB(db: IDBDatabase, storeName: string, id: string): Promise<Event> {
  const request = db.transaction([storeName], 'readwrite').objectStore(storeName).delete(id)

  return new Promise((resolve) => {
    request.onsuccess = function (ev) {
      resolve(ev)
    }

    request.onerror = function (ev) {
      resolve(ev)
    }
  })
}

/**
 * 删除数据库
 */
export function deleteDBAll(dbName: string): Promise<string> {
  console.log(dbName)
  const deleteRequest = window.indexedDB.deleteDatabase(dbName)

  return new Promise((resolve, reject) => {
    deleteRequest.onerror = function () {
      console.log('删除失败')
      reject(new Error('删除失败'))
    }
    deleteRequest.onsuccess = function () {
      console.log('删除成功')
      resolve('删除成功')
    }
  })
}

/**
 * 关闭数据库
 */
export function closeDB(db: IDBDatabase): void {
  db.close()
  console.log('数据库已关闭')
}

export default {
  openDB,
  addData,
  getDataByKey,
  cursorGetData,
  getDataByIndex,
  cursorGetDataByIndex,
  updateDB,
  deleteDB,
  deleteDBAll,
  closeDB,
}
