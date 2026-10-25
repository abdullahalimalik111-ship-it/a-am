import test from 'node:test';
import assert from 'node:assert/strict';
import {
  VALID_REDEEM_CODES,
  DEFAULT_PROFILE,
  redeemCodeAction,
} from './redeemAndProfile.ts';
import { JJK_CHARACTERS } from './jjkCharacters.ts';
import { ALL_SUKUNA_ABILITIES } from './sukunaAbilities.ts';

test('VALID_REDEEM_CODES contains expected reward codes', () => {
  assert.ok(VALID_REDEEM_CODES['FUGA2026']);
  assert.ok(VALID_REDEEM_CODES['MALEVOLENT']);
  assert.ok(VALID_REDEEM_CODES['SIXEYES']);
  assert.ok(VALID_REDEEM_CODES['MAXFINGERS']);
  assert.equal(VALID_REDEEM_CODES['MAXFINGERS'].rewardFingers, 20);
});

test('redeemCodeAction successfully applies rewards and caps fingers at 20', () => {
  const profile = { ...DEFAULT_PROFILE, fingersConsumed: 10, redeemedCodes: [] };
  const res = redeemCodeAction('FUGA2026', profile);

  assert.equal(res.success, true);
  assert.equal(res.updatedProfile.fingersConsumed, 15);
  assert.ok(res.updatedProfile.cursedEnergy > profile.cursedEnergy);
  assert.ok(res.updatedProfile.redeemedCodes.includes('FUGA2026'));

  // Test duplicate rejection
  const dupRes = redeemCodeAction('FUGA2026', res.updatedProfile);
  assert.equal(dupRes.success, false);
  assert.ok(dupRes.message.includes('already been redeemed'));

  // Test capping at 20
  const maxRes = redeemCodeAction('MAXFINGERS', dupRes.updatedProfile);
  assert.equal(maxRes.success, true);
  assert.equal(maxRes.updatedProfile.fingersConsumed, 20);
});

test('JJK_CHARACTERS includes Gojo, Sukuna, Yuta, Toji, and Megumi', () => {
  const ids = JJK_CHARACTERS.map((c) => c.id);
  assert.ok(ids.includes('sukuna'));
  assert.ok(ids.includes('gojo'));
  assert.ok(ids.includes('yuta'));
  assert.ok(ids.includes('toji'));
  assert.ok(ids.includes('megumi'));
  assert.ok(ids.includes('itadori'));
});

test('ALL_SUKUNA_ABILITIES includes complete arsenal with World Slash & Fuga', () => {
  const abilityIds = ALL_SUKUNA_ABILITIES.map((a) => a.id);
  assert.ok(abilityIds.includes('dismantle'));
  assert.ok(abilityIds.includes('cleave'));
  assert.ok(abilityIds.includes('world_slash'));
  assert.ok(abilityIds.includes('fuga'));
  assert.ok(abilityIds.includes('malevolent_shrine'));
  assert.ok(abilityIds.includes('mahoraga_adapt'));
  assert.ok(abilityIds.includes('kamutoke'));
  assert.ok(abilityIds.includes('heian_true_form'));
});
