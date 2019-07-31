import { Reserve, ReserveType } from '@/class'

class Project extends Reserve {
  private complicated: boolean
  private can_finish: boolean
  private finished: boolean
  private progress: number
  private requirements: string[]

  constructor(projectData: any) {
    super(projectData)
    this.type = ReserveType.Project
    this.complicated = projectData.complicated
    this.can_finish = projectData.can_finish
    this.finished = projectData.finished
    this.progress = projectData.progress
    this.requirements = projectData.requirements
  }

  public get IsComplicated(): boolean {
    return this.complicated
  }

  public get CanFinish(): boolean {
    return this.can_finish
  }

  public set CanFinish(b: boolean) {
    this.can_finish = b
    this.save()
  }

  public get IsFinished(): boolean {
    return this.finished
  }

  public set IsFinished(b: boolean) {
    this.finished = b
    this.save()
  }

  public get Progress(): number {
    return this.progress
  }

  public set Progress(p: number) {
    this.progress = p
    this.save()
  }

  public get Requirements(): string[] {
    return this.requirements
  }

  public set Requirements(r: string[]) {
    this.requirements = r
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

  public static Deserialize(data: IProjectData) {
    return new Project(data)
  }
}

export default Project
