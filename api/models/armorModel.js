const mongoose = require('mongoose');

const { Schema } = mongoose;

const armorSchema = new Schema(
  {
      "code": { type: Number, required: true},
      "name": { type: String},
      "itemType": { type: String},
      "armorType": { type: String},
      "itemGrade": { type: String},
      "craftAnimTrigger": { type: String},
      "stackable": { type: Number},
      "initialCount": { type: Number},
      "makeMaterial1": { type: Number},
      "makeMaterial2": { type: Number},
      "attackPower": { type: Number},
      "defense":{ type: Number},
      "maxHp": { type: Number},
      "maxSp": { type: Number},
      "hpRegenRatio": { type: Number},
      "hpRegen": { type: Number},
      "spRegenRatio": { type: Number},
      "spRegen": { type: Number},
      "attackSpeedRatio":{ type: Number},
      "criticalStrikeChance":{ type: Number},
      "criticalStrikeDamage": { type: Number},
      "preventCriticalStrikeDamaged": { type: Number},
      "cooldownReduction": { type: Number},
      "lifeSteal": { type: Number},
      "moveSpeed":{ type: Number},
      "sightRange": { type: Number},
      "outOfCombatMoveSpeed": { type: Number},
      "attackRange": { type: Number},
      "increaseBasicAttackDamage": { type: Number},
      "preventBasicAttackDamaged": { type: Number},
      "increaseSkillDamage": { type: Number},
      "preventSkillDamaged": { type: Number},
      "increaseSkillDamageRatio": { type: Number},
      "preventSkillDamagedRatio": { type: Number},
      "decreaseRecoveryToBasicAttack": { type: Number},
      "decreaseRecoveryToSkill": { type: Number}
	},
  { collection: 'itemArmor' }
);

module.exports = mongoose.model('itemArmor', armorSchema);