**KINGDOM**

**FAIR DEAL PROTOCOL**

**Version 0.1**

<table>
<colgroup>
<col style="width: 1%" />
<col style="width: 98%" />
</colgroup>
<thead>
<tr class="header">
<th></th>
<th><p><strong>Core doctrine</strong></p>
<p>Not everything valuable must be charged, but everything valuable
should be visible.</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

A non-commission, energy-first protocol for fair negotiation,
transparent agreements, transaction memory, and verified benevolent
contribution.

**Project:** STVcentral’s Kingdom Infrastructure

**Status:** Working constitutional specification — settled decisions
plus implementation blueprint

**Date:** July 14, 2026

**Current human coefficient:** H_i = 625 (unchanged)

**Purpose of this document**

To convert the day’s conceptual decisions into a stable, auditable
foundation that can guide the calculator, the AI negotiation layer, the
ledger, reputation, and a future MVP.

**NAVIGATION**

# **Contents**

| **Section** | **Subject**                          |
|-------------|--------------------------------------|
| 1           | Protocol in one page                 |
| 2           | Constitutional principles            |
| 3           | System architecture                  |
| 4           | Energy-first value model             |
| 5           | Invoice mode and full-value mode     |
| 6           | Transaction lifecycle and ledger     |
| 7           | Benevolent contribution              |
| 8           | Reputation without ratings           |
| 9           | Fair-AI negotiation room             |
| 10          | Band-show worked example             |
| 11          | MVP scope and build sequence         |
| 12          | Core data model                      |
| 13          | Safeguards and non-goals             |
| 14          | Settled decisions and open questions |
| 15          | Implementation handoff               |

<table>
<colgroup>
<col style="width: 1%" />
<col style="width: 98%" />
</colgroup>
<thead>
<tr class="header">
<th></th>
<th><p><strong>Interpretation rule</strong></p>
<p>This document distinguishes settled rules from proposals. “Settled”
means accepted in the design discussion. “Open” means intentionally left
for later validation.</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

**EXECUTIVE VIEW**

# **1. Protocol in one page**

Kingdom Infrastructure is a non-commission transaction and negotiation
system that helps people recognize, discuss, and exchange visible and
unseen value fairly. Its public interface is conversational AI; its
mathematical foundation is the auditable KingdomWatt engine.

The platform helps parties form a deal, records what they agreed to, and
remembers how the transaction ended. It does not enforce the deal, judge
guilt, or become a private court.

## **The three layers**

| **Layer**             | **Purpose**                                         | **Primary output**                                                             |
|-----------------------|-----------------------------------------------------|--------------------------------------------------------------------------------|
| KingdomWatt kernel    | Deterministic energy-based measurement and presets. | Auditable values, assumptions, confidence, and allocation.                     |
| Fair-AI negotiation   | Private advocates plus a neutral mediator.          | Mutually intelligible deal options and a consent-ready agreement.              |
| Ledger and reputation | Records agreed terms and transaction outcomes.      | Transaction history, benevolent contribution, and unhappy-transaction context. |

## **The decisive distinctions**

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th><p><strong>Benevolent contribution = agreed full value − agreed
settlement</strong></p>
<p><em>The value knowingly released without equivalent
settlement.</em></p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th><p><strong>Unfulfilled obligation = agreed settlement − delivered
settlement</strong></p>
<p><em>A broken or incomplete promise; never reclassified as
generosity.</em></p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

<table>
<colgroup>
<col style="width: 1%" />
<col style="width: 98%" />
</colgroup>
<thead>
<tr class="header">
<th></th>
<th><p><strong>Energy first</strong></p>
<p>Every primary number is expressed in KingdomWatts. Currency is only
one possible settlement medium and may be shown through an explicit
bridge; it never defines the underlying value.</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

# **2. Constitutional principles**

| **Principle**                | **Rule**                                                                                                                                                                |
|------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Visibility before price      | Not everything valuable must be charged, but everything valuable should be visible.                                                                                     |
| Energy before currency       | Value is measured from human energy, presence, resources, risk, and contribution—not from the currency amount offered.                                                  |
| Price is not value           | A CAD \$200 deal may activate far more value without making the performance “worth only \$200.”                                                                         |
| Consent over coercion        | The AI proposes and explains. Humans accept, reject, or revise. The platform does not bind them autonomously.                                                           |
| Record, do not enforce       | The platform records agreements and outcomes but does not collect debts, decide guilt, or impose obedience.                                                             |
| Transaction-gated reputation | Only verified parties to an actual transaction may affect that transaction’s reputation record.                                                                         |
| No five-star theatre         | Reputation is factual transaction history, not popularity, fan voting, or a compressed moral score.                                                                     |
| Generosity is visible        | The agreed gap between full value and settlement is automatically recorded as benevolent contribution.                                                                  |
| Broken promises stay broken  | Undelivered agreed settlement is an unfulfilled obligation, not a retroactive contribution.                                                                             |
| No commission incentive      | The platform does not profit by taking a percentage of the value exchanged and therefore should not optimize for higher deal prices merely to increase its own revenue. |
| Auditability                 | Formulas, presets, assumptions, allocations, and confidence must be explainable and reviewable.                                                                         |
| Currency creation tabled     | Benevolent contribution is non-spendable recognition. It does not mint KW₭ or automatically create advertising credit.                                                  |

# **3. System architecture**

## **3.1 KingdomWatt kernel**

The existing calculator remains the educational and audit interface. Its
formulas and presets become callable services beneath the AI. The
current website human coefficient stays at H_i = 625 unless a future
validated decision explicitly changes it.

- Accept structured inputs for people, time, energy, presence,
  equipment, materials, travel, risk, reusable preparation, and external
  settlement.

- Return energy values in KW₭ with the contributing components visible.

- Preserve preset versions so later rule changes do not rewrite
  historical agreements.

- Distinguish direct delivered value, reusable value activated,
  transaction expenses, and embedded capacity.

- Never allow a language model to silently replace deterministic
  calculations.

## **3.2 Fair-AI layer**

The public user should not have to understand coefficients. They
describe the exchange in ordinary language. The AI asks only the missing
questions, maps the answers to the kernel, and explains the result.

| **Agent**        | **Duty**                                                         | **Privacy boundary**                                                |
|------------------|------------------------------------------------------------------|---------------------------------------------------------------------|
| Party A advocate | Clarify goals, contributions, limits, and acceptable structures. | Private limits stay private unless the party authorizes disclosure. |
| Party B advocate | Clarify budget, resources, risks, needs, and non-cash offers.    | Private limits stay private unless the party authorizes disclosure. |
| Neutral mediator | Compare authorized facts and propose understandable agreements.  | Sees only shared facts and permitted negotiation ranges.            |

## **3.3 Ledger and reputation**

Only mutually agreed terms enter the ledger as the official transaction.
The ledger then records delivery, settlement, completion, revision,
cancellation, dispute, or resolution without claiming authority to
enforce.

# **4. Energy-first value model**

KingdomWatts are the unit of accounting. Currency, goods, services,
access, food, transportation, footage, revenue share, and other benefits
are settlement media whose value is translated into energy terms for the
agreement.

## **4.1 Core value categories**

| **Category**            | **Definition**                                                                                                                     |
|-------------------------|------------------------------------------------------------------------------------------------------------------------------------|
| Direct delivered value  | Work and value delivered specifically in the transaction: performance, setup, service time, production, transport, administration. |
| Transaction expenses    | Fuel, parking, materials, rentals, permits, consumables, and other out-of-pocket inputs.                                           |
| Equipment deployment    | Use, wear, risk, transport, and energy consumption of tools and equipment.                                                         |
| Reusable preparation    | Rehearsals, arrangements, templates, software, set design, or preparation that can serve more than one transaction.                |
| Embedded capacity       | Skill, repertoire, trust, reputation, audience, systems, and accumulated ability activated in the exchange.                        |
| Risk and constraints    | Cancellation exposure, exclusivity, damage exposure, timing scarcity, uncertainty, or opportunity cost.                            |
| Settlement received     | All concrete value promised in return, expressed in energy equivalents.                                                            |
| Benevolent contribution | The mutually agreed value provided beyond the mutually agreed settlement.                                                          |

## **4.2 Currency bridge**

A currency amount may be displayed for practical settlement, but the
transaction stores both the original amount and the energy bridge used
at agreement time. Later bridge changes must not rewrite historical
records.

<table>
<colgroup>
<col style="width: 1%" />
<col style="width: 98%" />
</colgroup>
<thead>
<tr class="header">
<th></th>
<th><p><strong>Required display order</strong></p>
<p>Show KW₭ first. Show currency only as an optional settlement
translation: “2,500 KW₭, settled as approximately CAD $200 using the
agreed bridge.”</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

# **5. Invoice mode and full-value mode**

| **Mode**        | **Question answered**                                  | **Includes**                                                                                       |
|-----------------|--------------------------------------------------------|----------------------------------------------------------------------------------------------------|
| Invoice mode    | What immediate settlement is reasonable for this deal? | Direct work, expenses, deployment, risk, and a justified allocation of reusable preparation.       |
| Full-value mode | What total value is being activated or transferred?    | Invoice components plus embedded and reusable value that may not be fully chargeable to one buyer. |

The two modes prevent a common error: treating every valuable input as
though it must be invoiced fully to the present buyer. Rehearsal is
valuable, but a reusable set may serve many shows. Full-value mode
reveals it; invoice mode allocates it reasonably.

<table>
<colgroup>
<col style="width: 1%" />
<col style="width: 98%" />
</colgroup>
<thead>
<tr class="header">
<th></th>
<th><p><strong>Interpretive example</strong></p>
<p>A one-hour show may have a CAD $200 settlement, a 6,000 KW₭ invoice
estimate, and a 10,000 KW₭ full-value record. All three can be true
simultaneously.</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

# **6. Transaction lifecycle and ledger**

| **Stage**       | **Function**                                                                                 |
|-----------------|----------------------------------------------------------------------------------------------|
| Describe        | Each party describes the exchange, goals, constraints, and contributions.                    |
| Clarify         | Advocates ask only the missing questions and flag assumptions.                               |
| Measure         | The kernel produces invoice-mode and full-value estimates in KW₭.                            |
| Negotiate       | The mediator proposes deal structures without revealing private limits.                      |
| Agree           | Both parties approve the shared terms, valuations, settlement, obligations, and permissions. |
| Record          | The signed-off agreement becomes the immutable transaction version.                          |
| Deliver         | The parties perform their obligations outside the platform’s coercive control.               |
| Confirm outcome | Each party records delivery, satisfaction, revision, cancellation, dispute, or resolution.   |
| Update history  | The ledger updates benevolent contribution and transaction-based reputation facts.           |

## **6.1 Ledger equations**

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th><p><strong>B = max(0, V_agreed − S_agreed)</strong></p>
<p><em>B = benevolent contribution; V = mutually agreed full value; S =
mutually agreed settlement.</em></p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th><p><strong>U = max(0, S_agreed − S_delivered)</strong></p>
<p><em>U = unfulfilled obligation. It remains separate from benevolent
contribution.</em></p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th><p><strong>Completed settlement ratio = S_delivered ÷
S_agreed</strong></p>
<p><em>Used as transaction context, not as a universal moral
score.</em></p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

## **6.2 Statuses**

| **Status**                  | **Meaning**                                                                |
|-----------------------------|----------------------------------------------------------------------------|
| Draft                       | Private and editable; no reputation impact.                                |
| Proposed                    | Shared for review; no reputation impact.                                   |
| Agreed                      | Mutually accepted; official terms recorded.                                |
| In progress                 | Delivery period has started.                                               |
| Completed                   | Agreed delivery and settlement confirmed.                                  |
| Completed with unhappiness  | Completed, but at least one party reports an unsatisfactory outcome.       |
| Unresolved                  | A material part of delivery or settlement remains contested or incomplete. |
| Resolved after disagreement | The parties later acknowledge a workable resolution.                       |
| Cancelled by agreement      | Both parties accepted cancellation terms.                                  |

# **7. Benevolent contribution**

Because only mutually agreed terms enter the ledger, an agreed gap
between full value and settlement is voluntary by definition. It does
not require a second donation step after completion.

<table>
<colgroup>
<col style="width: 1%" />
<col style="width: 98%" />
</colgroup>
<thead>
<tr class="header">
<th></th>
<th><p><strong>Settled rule</strong></p>
<p>Agreed value minus agreed settlement is automatically recorded as a
benevolent contribution to the world.</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

## **7.1 Properties**

- Non-spendable and non-transferable.

- Does not create new KW₭.

- Does not automatically create advertising credit, ranking priority, or
  other guaranteed economic privilege.

- Transaction-backed and traceable to the agreement that produced it.

- Publicly visible only according to the contributor’s chosen profile
  privacy settings.

- Shown separately from unsettled, disputed, or unfulfilled amounts.

- May be displayed as lifetime total, recent total, category breakdown,
  and transaction count.

## **7.2 Why recognition is enough**

A large verified benevolent-contribution number can be a meaningful form
of status for people proud of what they have given. Keeping it
non-spendable protects the signal: the recognition itself is the reward,
not a disguised route to currency creation or platform advantage.

# **8. Reputation without ratings**

Reputation is not open commentary and not a five-star score. It is a
factual summary of the person’s verified transaction history.

## **8.1 Who may affect reputation**

<table>
<colgroup>
<col style="width: 1%" />
<col style="width: 98%" />
</colgroup>
<thead>
<tr class="header">
<th></th>
<th><p><strong>Hard gate</strong></p>
<p>Only a verified party listed in the on-platform transaction may
affect that transaction’s reputation outcome. Fans, followers,
competitors, outsiders, and mobs have no rating power.</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

Content-safety reporting may remain a separate moderation function, but
it must never alter transactional reputation unless the reporter was an
actual party to the deal.

## **8.2 Public reputation fields**

| **Field**                   | **Example** | **Interpretation**                                             |
|-----------------------------|-------------|----------------------------------------------------------------|
| Completed transactions      | 147         | Volume of completed agreements.                                |
| Transactions marked unhappy | 6           | At least one participant reported unhappiness.                 |
| Lifetime unhappy rate       | 4.1%        | Contextualizes the raw count.                                  |
| Currently unresolved        | 1           | Transactions still lacking a mutually acknowledged resolution. |
| Resolved after disagreement | 4           | Shows repair, not merely conflict.                             |
| Recent unhappy rate         | 1.2%        | Provides recency without erasing history.                      |

## **8.3 No guilt verdict**

The platform does not label a participant guilty, innocent, victim,
complainer, difficult, or trustworthy. It shows what happened
procedurally: a real transaction existed, one or both parties were
unhappy, and the matter is resolved or unresolved.

# **9. Fair-AI negotiation room**

## **9.1 User experience**

A common user begins with a natural-language description rather than a
calculator form. Example: “We are a five-person band playing one hour.
The venue can pay \$200. We bring our gear, drive separately, and expect
about sixty people.”

The AI identifies unseen components, asks concise clarifying questions,
and returns a deal map in KW₭. The user can inspect the assumptions,
revise them, or open the full calculator.

## **9.2 Mediator output**

- Shared facts and assumptions.

- Invoice-mode estimate and full-value estimate in KW₭.

- Agreed settlement options, including concrete non-cash value.

- Benevolent contribution implied by each option.

- Obligations, deadlines, permissions, rights, cancellation terms, and
  risk allocation.

- A plain-language fairness explanation and uncertainty statement.

- Accept, reject, or revise controls for each party.

## **9.3 AI limits**

- May infer ordinary missing structure, but must label assumptions.

- May not disclose a party’s private minimum, maximum, or motive without
  permission.

- May not claim that a deal is objectively fair merely because both
  parties accepted it.

- May not present vague “exposure” as settlement without concrete
  deliverables.

- May not alter the formula or coefficient silently.

- May not create or spend currency.

- May not enforce the agreement or decide guilt.

# **10. Band-show worked example**

Scenario: five musicians—two guitarists, one drummer, one bassist, and
one lead singer—play a one-hour local show. The venue offers CAD \$200.
The band brings equipment and each member spends approximately CAD \$30
on fuel. Exact values below are illustrative until the final preset is
calibrated.

## **10.1 Example value map**

| **Component**                       | **Illustrative KW₭** | **Notes**                                                          |
|-------------------------------------|----------------------|--------------------------------------------------------------------|
| Direct performance and event labour | 5,600                | Performance, setup, teardown, coordination.                        |
| Travel and fuel                     | 1,500                | Human travel plus external fuel settlement translated into energy. |
| Equipment deployment                | 600                  | Amplifiers, pedals, instruments, transport, and wear.              |
| Reusable preparation activated      | 2,300                | Repertoire and rehearsal value visible in full-value mode.         |
| Full agreed value                   | 10,000               | Illustrative mutually accepted full-value figure.                  |
| Agreed settlement                   | 2,500                | Equivalent of CAD \$200 at the selected agreement bridge.          |
| Benevolent contribution             | 7,500                | Automatically recorded because it was knowingly agreed.            |

## **10.2 Outcome variations**

| **Outcome**                                       | **Ledger result**                                                                   |
|---------------------------------------------------|-------------------------------------------------------------------------------------|
| Venue delivers the full agreed settlement         | Transaction completed; 7,500 KW₭ benevolent contribution recorded.                  |
| Venue promised 2,500 KW₭ but delivers only 1,500  | 1,000 KW₭ unfulfilled obligation; benevolent contribution remains 7,500, not 8,500. |
| Band and venue revise the deal before performance | A new agreement version is accepted; only the latest accepted terms govern.         |
| A fan dislikes the band and tries to rate them    | No effect: the fan was not a transaction party.                                     |

# **11. MVP scope and build sequence**

## **Phase 1 — Protocol and kernel contract**

1.  Finalize the value ontology and formula vocabulary.

2.  Define preset versioning and confidence rules.

3.  Expose the existing calculator as a deterministic internal service
    without changing H_i = 625.

4.  Implement invoice mode, full-value mode, benevolent contribution,
    and unfulfilled obligation.

## **Phase 2 — Single-party Fair Deal Interview**

5.  Natural-language intake.

6.  AI-generated question list.

7.  Value map and assumptions.

8.  Invoice and full-value views.

9.  Draft agreement export.

## **Phase 3 — Two-party Deal Room**

10. Private advocate for each party.

11. Shared facts and selective disclosure.

12. Mediator-generated options.

13. Dual consent and agreement versioning.

14. Ledger creation.

## **Phase 4 — Outcome and reputation**

15. Delivery and settlement confirmation.

16. Unhappy and unresolved states.

17. Resolution updates.

18. Transaction-gated reputation profile.

19. Benevolent-contribution profile totals.

<table>
<colgroup>
<col style="width: 1%" />
<col style="width: 98%" />
</colgroup>
<thead>
<tr class="header">
<th></th>
<th><p><strong>Recommended first coded prototype</strong></p>
<p>One user describes a deal; the system produces an energy-first value
map, two modes, an agreement draft, benevolent contribution, and
unfulfilled-obligation fields. Two-party negotiation can follow once the
core semantics are stable.</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

# **12. Core data model**

The companion JSON file delivered with this document contains a
machine-readable v0.1 schema. The following table summarizes the
essential records.

| **Record**             | **Role**                                                                                             |
|------------------------|------------------------------------------------------------------------------------------------------|
| ProtocolVersion        | Formula version, coefficient version, preset versions, and constitutional rule version.              |
| Party                  | Verified identity, display settings, private negotiation settings, and authorization boundaries.     |
| Transaction            | Parties, purpose, timestamps, current status, and version history.                                   |
| ValueComponent         | Category, contributor, quantity, energy, presence, confidence, reuse allocation, and evidence.       |
| Valuation              | Invoice value, full value, assumptions, uncertainty, and approval state.                             |
| SettlementTerm         | Settlement medium, amount in native units, agreed KW₭ equivalent, due conditions, and permissions.   |
| Obligation             | Who promises what, to whom, by when, and how completion is acknowledged.                             |
| AgreementVersion       | Immutable accepted snapshot of facts, values, settlement, obligations, and disclosures.              |
| Outcome                | Delivered value, delivered settlement, satisfaction flags, unresolved items, and resolution history. |
| ReputationSummary      | Completed, unhappy, unresolved, resolved, and recent/lifetime rates.                                 |
| BenevolentContribution | Transaction-backed non-spendable difference between agreed value and agreed settlement.              |

# **13. Safeguards and non-goals**

## **13.1 Safeguards**

- No reputation effect without a verified transaction relationship.

- No public accusation text required for an unhappy marker.

- Mutual agreement required before terms enter the official ledger.

- Every accepted agreement keeps an immutable version snapshot.

- Every AI inference is distinguishable from a human-provided fact.

- Every currency translation stores the bridge and timestamp used.

- Benevolent contribution cannot be spent, transferred, or converted
  automatically.

- Unfulfilled obligations cannot be reclassified as benevolence.

- The platform should disclose related-party and repetitive transaction
  patterns when context is relevant, without declaring fraud.

- Moderation reports remain separate from transactional reputation.

## **13.2 Explicit non-goals**

- Becoming a court, police service, debt collector, or compulsory
  arbitration authority.

- Producing a universal moral score.

- Making every unequal exchange impossible.

- Forcing users to charge the maximum recognizable value.

- Replacing human consent with AI authority.

- Creating KW₭ from two-party valuation gaps.

- Rewarding benevolent totals with automatic advertising or financial
  privileges in v0.1.

# **14. Settled decisions and open questions**

## **14.1 Settled in v0.1**

- The calculator remains the auditable kernel; conversational AI becomes
  the main public interface.

- Invoice mode and full-value mode are both required.

- All primary values are energy-first and expressed in KW₭.

- Currency is an optional settlement bridge, not the basis of value.

- The platform records agreements but does not enforce them.

- Only verified transaction parties can affect reputation.

- Reputation uses unhappy/unresolved/resolved transaction facts, not
  stars and not guilt labels.

- Only agreed terms enter the ledger.

- Agreed value minus agreed settlement is automatically recorded as
  benevolent contribution.

- Agreed settlement minus delivered settlement is an unfulfilled
  obligation.

- Benevolent contribution is non-spendable and does not mint KW₭.

- Currency creation and automatic advertising rewards are tabled.

- H_i remains 625 in the current calculator.

## **14.2 Open for later validation**

- Exact band, venue, freelance, product, and community-service presets.

- How reusable preparation is allocated across expected uses.

- How equipment deployment and depreciation are translated into energy
  consistently.

- Which identity verification level is required for different
  transaction sizes.

- How much public transaction context accompanies benevolent totals.

- Whether parties may choose private, pseudonymous, or public
  contribution display.

- How cancellation, force majeure, partial delivery, and amended
  agreements affect outcome statuses.

- Legal wording, privacy compliance, and jurisdiction-specific agreement
  notices.

- The sustainable non-commission funding model for operating the
  infrastructure.

# **15. Implementation handoff**

This version is sufficiently concrete to begin a prototype without
reopening the settled constitutional rules. The implementation should
treat this document and its companion JSON as the initial contract
between product design, AI behavior, calculation, and ledger storage.

## **15.1 First prototype acceptance criteria**

- A user can describe a proposed exchange in ordinary language.

- The system extracts parties, contributions, durations, expenses,
  equipment, settlement, and missing facts.

- Every inferred fact is marked as an assumption until confirmed.

- The KingdomWatt kernel returns invoice-mode and full-value totals in
  KW₭.

- The interface shows the implied benevolent contribution before
  agreement.

- The generated agreement distinguishes agreed value, agreed settlement,
  and obligations.

- No transaction enters the official ledger until every listed party
  accepts the same version.

- Outcome fields can later calculate unfulfilled obligation without
  changing the original agreement.

## **15.2 Change-control rule**

Any future change to formulas, coefficients, reputation meaning,
benevolent contribution, or AI authority must create a new protocol
version. Historical transactions remain attached to the version accepted
when their agreement was formed.

<table>
<colgroup>
<col style="width: 1%" />
<col style="width: 98%" />
</colgroup>
<thead>
<tr class="header">
<th></th>
<th><p><strong>Next materialization target</strong></p>
<p>Convert this protocol into an interactive single-party Fair Deal
Interview prototype backed by the companion JSON schema and the existing
KingdomWatt kernel.</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

**END OF VERSION 0.1**
