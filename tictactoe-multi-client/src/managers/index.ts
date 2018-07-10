import ConnectionManager from "./connection";

export class Manager {
  private conn: ConnectionManager;

  public getConnectionManager() {
    if (this.conn === undefined) {
      this.conn = new ConnectionManager();
    }
    return this.conn;
  }
}

let manager: Manager;

function getManager() {
  if (manager === undefined) {
    manager = new Manager();
  }
  return manager;
}

export default getManager;