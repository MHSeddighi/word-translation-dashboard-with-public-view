export default class LocalStorageService {
  private static CHUNK_SIZE = 500;

  private static asyncTask(task: () => void): void {
    setTimeout(() => {
      try {
        task();
      } catch (error) {
        console.error("Error executing task:", error);
      }
    }, 0);
  }

  static saveAllChunks<T extends NonNullable<unknown>>(
    key: string,
    data: T
  ): void {
    const dataKeys = typeof data === "object" ? Object.keys(data) : [];
    if (dataKeys.length > LocalStorageService.CHUNK_SIZE) {
      let index = 0;
      let chunk_index = 1;

      const saveChunk = () => {
        let chunk = "";
        const end = Math.min(
          index + LocalStorageService.CHUNK_SIZE,
          dataKeys.length
        );
        if (Array.isArray(data)) {
          chunk = JSON.stringify(data.slice(index, end));
        } else if (typeof data === "object") {
          for (let i = index; i < end; i++) {
            chunk += `${dataKeys[i]}:${JSON.stringify(
              (data as Record<string, unknown>)[dataKeys[i]]
            )},`;
          }
          chunk = `{${chunk}}`;
        }

        index = end;

        localStorage.setItem(`${key}_chunk${chunk_index}`, chunk);
        chunk_index++;

        if (index < dataKeys.length) {
          this.asyncTask(saveChunk);
        } else {
          console.log("Data saved successfully.");
        }
      };

      saveChunk();
    } else {
      localStorage.setItem(key, JSON.stringify(data));
      console.log("Data saved successfully.");
    }
  }

  static get(key: string, callback: (d: unknown) => void) {
    let savedData = localStorage.getItem(`${key}_chunk1`);
    if (savedData) {
      this.getAllChunks(key, callback);
    } else {
      savedData = localStorage.getItem(`${key}`);
      try {
        const parsedData = JSON.parse(savedData ?? "");
        callback(parsedData);
      } catch (error) {
        console.log("Error parsing data from localStorage : " + error);
      }
    }
  }

  static getAllChunks(key: string, callback: (d: unknown) => void) {
    let chunk_index = 1;

    const parseData = () => {
      const savedData = localStorage.getItem(`${key}_chunk${chunk_index}`);
      chunk_index++;
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          callback(parsedData);
        } catch (error) {
          console.log("Error parsing data from localStorage : " + error);
        }
        this.asyncTask(parseData);
      }
    };

    parseData();
  }

  static clearAll(key: string): void {
    this.asyncTask(() => {
      try {
        localStorage.removeItem(key);
        console.log(`Data cleared for key: ${key} from localStorage.`);
      } catch (error) {
        console.error("Error clearing data from localStorage:", error);
      }
    });
  }

  static updateChunk<T>(chunk_key: string, newData: T): void {
    const chunkData = localStorage.getItem(`${chunk_key}`);
    if (chunkData) {
      try {
        localStorage.setItem(`${chunk_key}`, JSON.stringify(newData));
        console.log(`Chunk ${chunk_key} updated successfully.`);
      } catch (error) {
        console.error("Error updating chunk:", error);
      }
    } else {
      console.warn(`Chunk ${chunk_key} not found in localStorage.`);
    }
  }
}
