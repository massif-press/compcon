import { readFileSync } from 'fs'
import lancerData from 'lancer-data'
import XLSX from 'xlsx'

import uid from './uid'

const translationTable: {
    [key: string]: { [key: string]: string };
} = lancerData.translation_table
const frames: Frame[] = lancerData.frames

// return a cell code from a cell code and an offset
const offsetCell = (cell: string, offset: number[]): string => {
    const [offsetC, offsetR] = offset
    const decodedCell = XLSX.utils.decode_cell(cell)
    const [origC, origR] = [decodedCell.c, decodedCell.r]
    const newCell = { c: origC + offsetC, r: origR + offsetR }
    return XLSX.utils.encode_cell(newCell)
}

// converts sheet range to 2D array F
const sheetToArray = (
    sheet: XLSX.WorkSheet,
    rng: string,
): Array<Array<string | undefined>> => {
    const result = []
    let row
    let rowNum
    let colNum
    const range = XLSX.utils.decode_range(rng)
    for (rowNum = range.s.r; rowNum <= range.e.r; rowNum++) {
        row = []
        for (colNum = range.s.c; colNum <= range.e.c; colNum++) {
            const nextCell: XLSX.CellObject =
                sheet[XLSX.utils.encode_cell({ r: rowNum, c: colNum })]
            if (typeof nextCell === 'undefined') {
                row.push(nextCell)
            } else {
                row.push(nextCell.w)
            }
        }
        result.push(row)
    }
    return result
}

// function that looks up a gsheet item name in the translationTable for a given collection
// returns c/c item ID
const getItemID = (name: string, collection: string): string => {
    const result = translationTable[collection][name]
    if (!result) {
        throw new Error(`'${name}' not found in '${collection}'`)
    }
    if (result === 'KS_ONLY') {
        throw new Error("Sorry, we don't support Kickstarter content yet!")
    }
    if (result === 'INTEGRATED_IGNORE') {
        throw new Error(
            `Something went wrong. Tell ari "${name}" is causing issues...`,
        )
    }
    return result
}

// load sheet file from path
export const loadSheetFile = (path: string) => {
    const file = readFileSync(path)
    return XLSX.read(file, { type: 'buffer' })
}

// Main function
// All cell references here are based on the following sheet:
// https://docs.google.com/spreadsheets/d/1Tz8rbkOq9nyuIJ6bA0636dtLeN68Z5Q0yJF8cjycXxQ/edit?usp=sharing
// as of March 28th, 2019
// keep it up to date!
export const gsheetToObject = (wb: XLSX.WorkBook) => {
    const pilotSheet = wb.Sheets.Pilot
    const mechSheet = wb.Sheets.Mech
    const weaponsSheet = wb.Sheets.Weapons

    // generate our pilot's ID
    const pilotID = uid.generate()

    // get licenses
    const licenseRange = sheetToArray(mechSheet, 'B82:D93')
    const pilotLicenses: PilotLicense[] = []
    for (const row of licenseRange) {
        const licenseFullName = row[0]
        const level = parseInt(row[2] || '0')
        if (licenseFullName && licenseFullName !== '-' && level && level > 0) {
            const frameID = getItemID(licenseFullName, 'frames')
            const frm = frames.find((f: Frame) => f.id === frameID)
            if (!frm) {
                throw new Error('frame not found!')
            }
            const { name, source } = frm
            pilotLicenses.push({ name, source, level })
        }
    }

    // get pilot skills
    const skillRange = sheetToArray(pilotSheet, 'B33:E48')
    const pilotSkills: PilotSkill[] = []
    for (const row of skillRange) {
        const [skillName, , , skillLevel] = row
        if (!skillName || !skillLevel) {
            continue
        }
        if (skillName === '-') {
            continue
        }
        const id = getItemID(skillName, 'skills')
        if (parseInt(skillLevel) > 0) {
            pilotSkills.push({
                id,
                bonus: parseInt(skillLevel),
            })
        }
    }

    // get invocations
    const invocRange = sheetToArray(pilotSheet, 'B27:E30')
    const pilotInvocations: PilotInvocation[] = []
    for (const row of invocRange) {
        const [trigger, , , mode] = row
        if (!trigger || mode === '-') {
            continue
        }
        const invoc: PilotInvocation = { trigger }
        if (mode === 'Accuracy+') {
            invoc.accuracy = true
        } else if (mode === 'Difficulty+') {
            invoc.difficulty = true
        } else {
            continue
        }
        pilotInvocations.push(invoc)
    }

    // get talents
    // talent data is strewn about and not in a neat range, so make an array of the cells containing it
    const talentData = [
        [pilotSheet.M4, pilotSheet.R4],
        [pilotSheet.M18, pilotSheet.R18],
        [pilotSheet.M32, pilotSheet.R32],
        [pilotSheet.M46, pilotSheet.R46],
        [pilotSheet.M60, pilotSheet.R60],
        [pilotSheet.M74, pilotSheet.R74],
        [pilotSheet.M88, pilotSheet.R88],
        [pilotSheet.M102, pilotSheet.R102],
    ]
    const pilotTalents = []
    for (const row of talentData) {
        let [talentName, talentLevel] = row
        if (!(talentName && talentLevel)) {
            continue
        }
        talentName = talentName.w
        talentLevel = talentLevel.w
        if (talentName === 'Pilot Talent' || talentLevel === 0) {
            continue
        }
        const id = getItemID(talentName, 'talents')
        pilotTalents.push({
            id,
            rank: parseInt(talentLevel),
        })
    }

    // get core bonuses
    const sheetCoreBonuses = [
        mechSheet.B32.w,
        mechSheet.B38.w,
        mechSheet.B44.w,
        mechSheet.B50.w,
    ]
    const pilotCoreBonuses: string[] = []
    sheetCoreBonuses.forEach((bonusName) => {
        if (bonusName === 'No Bonus') {
            return
        }
        const coreBonusID: string = getItemID(bonusName, 'core_bonus')
        pilotCoreBonuses.push(coreBonusID)
    })

    // pilot gear
    // make a helper function that returns {id: getItemID(gearname)} or null if unsuccessful
    function safeGear(name: string): { id: string } | null {
        try {
            return { id: getItemID(name, 'pilot_gear') }
        } catch (e) {
            return null
        }
    }
    // make a loadout
    const pilotLoadout = {
        id: uid.generate(),
        items: {
            armor: [safeGear(pilotSheet.C6.w)],
            gear: [
                safeGear(pilotSheet.H26.w),
                safeGear(pilotSheet.H38.w),
                safeGear(pilotSheet.H50.w),
            ],
            weapon: [safeGear(pilotSheet.C18.w), safeGear(pilotSheet.H18.w)],
        },
        name: 'Loadout',
    }

    // systems
    // cells with system names
    const sheetSystems = [
        mechSheet.G18,
        mechSheet.G29,
        mechSheet.G62,
        mechSheet.G40,
        mechSheet.G73,
        mechSheet.G51,
        mechSheet.N31,
        mechSheet.N47,
        mechSheet.G84,
        mechSheet.N79,
        mechSheet.N63,
    ]
    const ignoredMods: string[] = []
    const mechSystems: ItemID[] = sheetSystems
        .filter((s) => s && s.w && s.w !== 'Empty') // filter out empty systems
        .map((s) => {
            // get the system IDs and convert them to the correct format
            const systemName = s.w
            const systemID = getItemID(systemName, 'systems')
            if (systemID === 'MOD_IGNORE') {
                // mods are ignored, push them to an array to inform the user
                ignoredMods.push(systemName)
                return false
            }
            return { id: systemID }
        })
        .filter((i) => i === false) as ItemID[] // delete ignored mods

    // cells with mount names
    const sheetMountCells = ['B2', 'B18', 'B34', 'B50']

    // get mech weapons
    // this relies on frame mounts in the sheet lining up with frame mounts defined in c/c
    // if that's not the case the mech will probably fail to render

    let imparmAdded = false
    const mechMounts: MechMount[] = []
    sheetMountCells.forEach((cell) => {
        // inititalize a mount object
        const mnt: MechMount = { mount_type: '', weapons: [], bonuses: [] }
        // get its type
        const mountType = weaponsSheet[cell].w
        // ignore integrated mounts
        if (mountType === 'Integrated') {
            return
        }
        // if the mount is empty, check if it's being used for improved armament
        if (mountType === '-') {
            // get the modifier for the mount (this is a gsheet thing, it's for Improved Armament and similar stuff)
            if (
                weaponsSheet[offsetCell(cell, [1, 0])].w ===
                'Improved Armament (Flex)'
            ) {
                // if so, make the mount a flex mount
                mnt.mount_type = 'Flex'
                mnt.imparm = true
                imparmAdded = true
            } else {
                return
            }
        } else {
            mnt.mount_type = mountType
        }
        // this is coded really silly
        mnt.weapons = [[1, 2], [7, 2]] // offsets for each of the mount's weapon slots
            .map((offset) => weaponsSheet[offsetCell(cell, offset)]) // turn the offsets into cells
            .filter((wepcell) => wepcell && wepcell.w !== 'Empty') // filter out empty weapon slots
            .map((wepcell) => ({ id: getItemID(wepcell.w, 'weapons') })) // turn the cells into weapon names
        mechMounts.push(mnt) // finally push the mount into the mounts list
    })

    // if the mech has less than 3 mounts and we haven't added an imparm mount, add one now
    if (mechMounts.length < 3 && !imparmAdded) {
        mechMounts.push({
            mount_type: 'Flex',
            weapons: [],
            bonuses: [],
            imparm: true,
        })
    }

    // create its loadout
    const mechLoadout: MechLoadout = {
        id: uid.generate(),
        name: 'Loadout',
        systems: mechSystems,
        mounts: mechMounts,
    }

    // create mech & fill out basic data
    const mechConfig: MechConfig = {
        id: uid.generate(),
        pilot_id: pilotID,
        name: mechSheet.J4.w,
        frame_id: getItemID(mechSheet.J5.w, 'frames'),
        loadouts: [mechLoadout],
    }

    const output: Pilot = {
        id: pilotID,
        callsign: pilotSheet.F2.w,
        name: pilotSheet.C2.w,
        level: parseInt(pilotSheet.C3.w),
        background: '',
        notes: pilotSheet.B89.w,
        history: pilotSheet.B79.w,
        contacts: [],
        licenses: pilotLicenses,
        loadouts: [pilotLoadout],
        skills: pilotSkills,
        invocations: pilotInvocations,
        talents: pilotTalents,
        mechSkills: {
            hull: parseInt(mechSheet.F14.w),
            agi: parseInt(mechSheet.G14.w),
            sys: parseInt(mechSheet.H14.w),
            eng: parseInt(mechSheet.I14.w),
        },
        core_bonuses: pilotCoreBonuses,
        configs: [mechConfig],
    }

    return {
        output,
        ignoredMods,
    }
}
