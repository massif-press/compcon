import store from "@/store";

class Background {
  private id: string;
  private name: string;
  private description: string;
  private triggers: string;

  constructor(id?: string, name?: string) {
    if (id) {
      const backgroundData = store.getters.getItemById("Backgrounds", id);
      this.id = backgroundData.id;
      this.name = backgroundData.name;
      this.description = backgroundData.description;
      this.triggers = backgroundData.triggers;
    } else {
      this.id = this.description = this.triggers = ""
      this.name = name || ""
    }
  }

  public get ID(): string {
    return this.id
  }

  public get Name(): string {
    return this.name
  }

  public get Description(): string {
    return this.description
  }

  public get Triggers(): string {
    return this.triggers
  }
}

export default Background;