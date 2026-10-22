# Design Values

Design values define the core evaluation criteria for enterprise web interfaces.

---

## 1. Natural

Align visual elements and interactions with natural physical laws and human perceptual habits.

### Perceptual Naturalness
- **Depth & Shadows**: Use multi-layer lighting models (Key, Ambient, Fill) to reflect realistic elevation distances.
- **Physical Continuity**: Motion must preserve acceleration, inertia, and dampening. Avoid abrupt teleports or instantaneous shifts.

### Behavioral Naturalness
- **Contextual Organization**: Structure features around task sequences, not internal database schemas.
- **Smart Defaults**: Pre-fill common values, remember previous user selections, and reduce required keystrokes.

---

## 2. Certain

Eliminate ambiguity and maintain low collaboration entropy across teams.

### Implementation Rules
- **Restraint**: Use the minimum number of design elements required to achieve the task.
- **Object-Oriented Design**: Abstract repeating patterns into standardized tokens (colors, spacings, radii).
- **State Determinism**: Ensure explicit visual feedback for every state (Normal, Hover, Active, Focus, Disabled, Loading, Error).
- **Clear Next Steps**: Explicitly show what the system did, what state it is currently in, and how to proceed.

---

## 3. Meaningful

Every visual element must convey functional information.

### Implementation Rules
- **Visual Weight Reserved for Action**: Keep saturated brand colors exclusively for primary calls to action.
- **Single Primary Action**: Provide at most one primary solid button per operational area. Secondary actions use outline, text, or link variants.
- **Zero Cosmetic Decoration**: Remove unnecessary background patterns, gradients, and purely decorative non-functional icons.

---

## 4. Growing

Ensure scalability across enterprise applications of varying complexity.

### Implementation Rules
- **Modular Token Cascade**: Base styling on Seed, Map, and Alias tokens to support dynamic density adjustments and custom themes.
- **Scale Invariance**: Components must function consistently whether inside a 3-field modal or a 50-column virtualized data table.
