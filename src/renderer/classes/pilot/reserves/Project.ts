import { Reserve, ReserveType } from '@/class'

class Project extends Reserve {
  private _complicated: boolean
  private _can_finish: boolean
  private _finished: boolean
  private _progress: number
  private _requirements: string[]

  public constructor(projectData: any) {
    super(projectData)
    this.type = ReserveType.Project
    this._complicated = projectData.complicated
    this._can_finish = projectData.can_finish
    this._finished = projectData.finished
    this._progress = projectData.progress
    this._requirements = projectData.requirements
  }

  public get IsComplicated(): boolean {
    return this._complicated
  }

  public get CanFinish(): boolean {
    return this._can_finish
  }

  public set CanFinish(b: boolean) {
    this._can_finish = b
    this.save()
  }

  public get IsFinished(): boolean {
    return this._finished
  }

  public set IsFinished(b: boolean) {
    this._finished = b
    this.save()
  }

  public get Progress(): number {
    return this._progress
  }

  public set Progress(p: number) {
    this._progress = p
    this.save()
  }

  public get Requirements(): string[] {
    return this._requirements
  }

  public set Requirements(r: string[]) {
    this._requirements = r
    this.save()
  }

  public static Serialize(project: Project): IProjectData {
    return {
      id: project.ID,
      type: ReserveType.Project,
      name: project.Name,
      label: project.ResourceLabel,
      description: project.Description,
      resource_name: project.ResourceName,
      resource_note: project.Note,
      resource_cost: project.ResourceCost,
      used: project.Used,
      complicated: project.IsComplicated,
      can_finish: project.CanFinish,
      finished: project.IsFinished,
      progress: project.Progress,
      requirements: project.Requirements,
    }
  }

  public static Deserialize(data: IProjectData): Project {
    return new Project(data)
  }
}

export default Project
