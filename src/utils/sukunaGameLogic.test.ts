import test from 'node:test';
import assert from 'node:assert/strict';
import {
  detectTechniqueInText,
  calculateSukunaDisposition,
  generateInCharacterResponse,
  calculateUserBattleRating,
  SUKUNA_OPENING_MESSAGE,
} from './sukunaGameLogic.ts';

test('detectTechniqueInText accurately identifies techniques', () => {
  const fugaResult = detectTechniqueInText('I witness Sukuna prepare his Fuga flame arrow!');
  assert.equal(fugaResult.hasFuga, true);
  assert.equal(fugaResult.technique, 'fuga');

  const domainResult = detectTechniqueInText('Malevolent Shrine expands across Shibuya!');
  assert.equal(domainResult.hasDomain, true);
  assert.equal(domainResult.technique, 'domain');

  const cleaveResult = detectTechniqueInText('He applies cleave to carve the sorcerer');
  assert.equal(cleaveResult.hasCleave, true);
  assert.equal(cleaveResult.technique, 'cleave');

  const dismantleResult = detectTechniqueInText('An invisible dismantle slash cuts through the building');
  assert.equal(dismantleResult.hasDismantle, true);
  assert.equal(dismantleResult.technique, 'dismantle');

  const blackFlashResult = detectTechniqueInText('Sparks of black! Black flash strikes!');
  assert.equal(blackFlashResult.hasBlackFlash, true);
  assert.equal(blackFlashResult.technique, 'black_flash');
});

test('calculateSukunaDisposition responds to battle aggression', () => {
  const initial = calculateSukunaDisposition([]);
  assert.equal(initial.mood, 'Mocking');
  assert.equal(initial.ruinRadius, 140);
  assert.equal(initial.playerHealthPct, 100);

  const aggressive = calculateSukunaDisposition([
    { role: 'user', content: 'I hit him with a Black Flash and try to expand my domain!' },
    { role: 'assistant', content: 'Mocking response' },
    { role: 'user', content: 'I strike with full cursed energy!' },
  ]);

  assert.ok(aggressive.amusementLevel > initial.amusementLevel);
  assert.ok(aggressive.ruinRadius > 140);
  assert.ok(aggressive.playerHealthPct < 100);
});

test('generateInCharacterResponse stays ruthlessly in character', () => {
  const domainReply = generateInCharacterResponse('I expand my Simple Domain!', []);
  assert.equal(domainReply.techniqueTriggered, 'domain');
  assert.ok(domainReply.reply.includes('Malevolent Shrine') || domainReply.reply.includes('Sukuna'));
  assert.ok(/brat|insect|fool/i.test(domainReply.reply));

  const punchReply = generateInCharacterResponse('I charge in with a Black Flash strike!', []);
  assert.equal(punchReply.techniqueTriggered, 'dismantle');
  assert.ok(/Dismantle/i.test(punchReply.reply));

  const fleeReply = generateInCharacterResponse('I try to run away and escape into the smoke', []);
  assert.equal(fleeReply.techniqueTriggered, 'cleave');
  assert.ok(/Cleave/i.test(fleeReply.reply));
});

test('calculateUserBattleRating accurately grades sorcerer endurance', () => {
  const survivor = calculateUserBattleRating(7, ['black_flash', 'simple_domain']);
  assert.equal(survivor.survivalGrade, 'Special Grade Survivor');

  const grade1 = calculateUserBattleRating(4, ['strike']);
  assert.equal(grade1.survivalGrade, 'Grade 1 Combatant');

  const casualty = calculateUserBattleRating(0, []);
  assert.equal(casualty.survivalGrade, 'Grade 4 Underling');
});

test('SUKUNA_OPENING_MESSAGE matches requested Shibuya opening', () => {
  assert.ok(SUKUNA_OPENING_MESSAGE.includes('stray dog in the dirt'));
  assert.ok(SUKUNA_OPENING_MESSAGE.includes('Make your move'));
  assert.ok(SUKUNA_OPENING_MESSAGE.includes('crimson flame curls around his fingertips'));
});
