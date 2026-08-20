import { describe, it, expect, beforeEach } from 'vitest'
import '@/__tests__/factories'
import { Campaign } from './Campaign'
import { CampaignSection } from './CampaignSection'
import { ContentBlock } from './CampaignContentBlock'

let campaign: Campaign

beforeEach(() => {
  campaign = new Campaign()
})

describe('Campaign', () => {
  it('starts with an id, a default title, and default ranges', () => {
    expect(campaign.ID).toBeTruthy()
    expect(campaign.Title).toBeTruthy()
    expect(campaign.Published).toBe(false)
  })

  it('takes editable metadata', () => {
    campaign.Title = 'Operation Solstice Rain'
    campaign.Subtitle = 'Act One'
    campaign.Description = 'Campaign description'
    campaign.Author = 'GM'

    expect(campaign.Title).toBe('Operation Solstice')
    expect(campaign.Subtitle).toBe('Act One')
    expect(campaign.Description).toBe('Campaign Description')
    expect(campaign.Author).toBe('GM')
  })

  it('round-trips', () => {
    campaign.Title = 'Operation Solstice Rain'
    campaign.Website = 'https://example.test'

    const once = Campaign.Serialize(campaign)
    const back = Campaign.Deserialize(JSON.parse(JSON.stringify(once)))

    expect(back.ID).toBe(campaign.ID)
    expect(back.Title).toBe('Operation Solstice Rain')
    expect(back.Website).toBe('https://example.test')
    expect(Campaign.Serialize(back)).toEqual(once)
  })
})

describe('CampaignSection', () => {
  it('nests sections and content blocks', () => {
    const section = new CampaignSection(null, campaign)
    const child = new CampaignSection(section, campaign)

    section.Children.push(child)
    section.Content.push(new ContentBlock(section, campaign))

    const data = CampaignSection.Serialize(section)

    expect(data.children).toHaveLength(1)
    expect(data.content).toHaveLength(1)
  })

  it('names a section after its type when given no title', () => {
    const section = new CampaignSection(null, campaign, {
      sectionType: 'chapter',
      content: [],
      children: [],
    } as never)

    expect(section.Title).toBe('New Chapter')
  })

  it('defaults to the plain section type', () => {
    expect(new CampaignSection(null, campaign).SectionType).toBe('section')
  })
})

describe('ContentBlock', () => {
  it('defaults to an empty text block', () => {
    const block = new ContentBlock(new CampaignSection(null, campaign), campaign)

    expect(block.ContentType).toBe('text')
    expect(ContentBlock.Serialize(block).contentType).toBe('text')
  })

  it('keeps its title and color', () => {
    const section = new CampaignSection(null, campaign)
    const block = new ContentBlock(section, campaign, {
      title: 'Briefing',
      color: 'primary',
      contentType: 'text',
      content: { Body: 'text' },
    } as never)

    const data = ContentBlock.Serialize(block)

    expect(data.title).toBe('Briefing')
    expect(data.color).toBe('primary')
  })
})
