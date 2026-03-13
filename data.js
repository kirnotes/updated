function cleanResolutionHint(text) {
  return String(text || "")
    .replace(/==========Remove if not applicable==========[\s\S]*$/i, "")
    .replace(/\* PROCESSED:\s*[\s\S]*?- Credit:\s*\$[\s\S]*?- Ref+und:\s*\$[\s\S]*/gi, "")
    .replace(/\* ADVISED:\s*Refund timeframe\s*\/\s*Delivery date where the credit will be used/gi, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function cleanHintMap(map) {
  return Object.fromEntries(
    Object.entries(map).map(([key, value]) => [
      key,
      {
        ...value,
        resolution: cleanResolutionHint(value.resolution)
      }
    ])
  );
}

export const WRAPS = [
  {
    name: "Account - 1st Box Change / Question",
    keywords: [
      "1st Order Confirmation","Cancellation - Didn't mean to order","Cancellation - Don't like the meal/s",
      "Cancellation - Don't like the service","Cancellation - No reason provided","CC Error","Change Box type",
      "Change Delivery Address (for a specific box)","Change Delivery Day","Christmas Box",
      "Customer Complaint - Disconnected Issue","Email Address Correction","Failed Verification","Follow Up",
      "Manager Call Back / Customer Resolutions","Meal Swap"
    ]
  },
  {
    name: "Account - After deadline change request",
    keywords: [
      "Cancellation - [Insert reason]","Cancellation - Delivery issues","Cancellation - Don't like meals",
      "Cancellation - Missed deadline","Cancellation - No reason provided","Cancellation - Price",
      "Cancellation - Quality issues","Cancellation - Trial box only","CC error","Change - Meal swap",
      "Change Address (for a specific box)","Change Box Type","Change Delivery window",
      "Customer Complaint - Disconnected Issue","Failed Verification","Manager Call Back / Customer Resolutions",
      "Manager Call Back / Escalation","Refund","Surcharge","Unaware of Subscription"
    ]
  },
  { name: "Account - Cancellation - Duplicated Subscription", keywords: ["Duplicate Account","Duplicate Cancellation","CC Error"] },
  {
    name: "Account - Cancellation - Customer Not Retained",
    keywords: [
      "Account Management Issues","Can't Afford / Out of Budget","Cancellation - [Insert reason]","CC Error",
      "Customer Complaint - Disconnected Issue","Delivery Issues","Didn't Like Meals","Failed Verification",
      "Manager Call Back / Customer Resolutions","Manager Call Back / Escalation","No Reason Provided",
      "Quality Issues","Trial Box","Unaware of Subscription"
    ]
  },
  {
    name: "Account - Cancellation - Customer Retained",
    keywords: [
      "Account Management Issues","CC Error","Delivery Issues","Didn't Like the Meals","Failed Verification",
      "Manager Call Back / Customer Resolutions","Manager Call Back / Escalation","No Reason Provided",
      "Quality Issues","Retained by CC","Trial Box","Unaware of Subscription"
    ]
  },
  {
    name: "Account - Data Protection",
    keywords: [
      "Account Removal","Blocked Account","Customer Complaint - DisconnectedIssue","Data Deletion",
      "Data Protection","Failed Verification","Manager Call Back / Customer Resolutions","Pending Verification",
      "Request Info","Subject Access Request","CC Error"
    ]
  },
  { name: "Account - Loyalty Program", keywords: ["Loyalty Program","CC Error"] },
  {
    name: "Account - Meal Swap / Recipe Preference",
    keywords: [
      "Add On","Customization","Dairy-free","Educate","Failed Verification","Flexitarian","Gluten-free","Halal",
      "Ingredient Inquiry","Keto","Low calorie","Meal Selection / Menu / Recipes","Meal Swap","Modularity",
      "Nutritional Information","Organic","Pescatarian","Plant-based","Pork-free","Preference",
      "Recipe Copy Request (PDF)","Recipe Inquiry","Seamless","Vegan","Veggie","CC Error"
    ]
  },
  { name: "Account - Reactivation", keywords: ["How to","CC Error"] },
  { name: "Account - Skip/Unskip", keywords: ["Skip - Can't afford","Skip - No reason provided","Skip - On vacation","Unskip","CC Error"] },
  {
    name: "Account -Update account / subscription details",
    keywords: [
      "Add Authorised Person","Cancellation Confirmation","Change Meal Size","Delivery Address Change",
      "Delivery Charge / Fee","Delivery Day","Delivery Frequency","Delivery Window","Email Address Update",
      "Failed Verification","How To","Leave Safe / Delivery Instructions","Password Reset","Payment Method Change",
      "Payment Method Issue","Phone Number Update","Postal Code Check","CC Error"
    ]
  },
  { name: "Complaint - Food Safety", keywords: [
    "Allergy","Customer Complaint - Disconnected Issue","Failed Verification","Food Poisoning","Food Safety Report",
    "Foreign Object","Label","Legal and Compliance","Manager Call Back / CustomerResolutions","Manager Call Back / Escalation",
    "No Ice Packs","Nutrition","Pest Contamination","Poisoning","Shelf Life","Sickness","Warm","CC Error"
  ]},
  { name: "Complaint - Quality", keywords: [
    "CC error","CERT","Customer Complaint - Disconnected Issue","Damage","Failed Verification","Frozen","Ice Packs",
    "Leaking / Spilled","Manager Call Back / Customer Resolutions","Mold","Open",
    "Photo Submission (use when receivedquality photo submission)","Poor Value Perception","Punctured / Torn","Rotten",
    "Seal open","Shelf Life Inquiry","Smelly","Spoiled","Substitution","Warm","Wilted"
  ]},
  { name: "Complaint - Pick & Pack", keywords: [
    "CC error","CERT","Customer Complaint - Disconnected Issue","Failed Verification","Free Add On For Life",
    "Incorrect","Ingredient Substitution","Manager Call Back / Customer Resolutions","Missing","Missing Recipe Card",
    "Recurring Missing","Wrong Portion/Size"
  ]},
  { name: "Logistics - Delivery status", keywords: [
    "Delivery Status Check","Marked Delivered - Not received","No Notification / Not contacted",
    "No Tracking Link Received","Tracking the Box","Where Is My Box?","CC Error"
  ]},
  { name: "Complaint - Logistic - Courier company", keywords: [
    "Property Damage","Manager Call Back / Customer Resolutions","Leave Safe","Instructions Not Followed",
    "Driver Behaviour","Damaged Boxes","Customer Complaint - DisconnectedIssue","CC Error"
  ]},
  { name: "Complaint - Logistics - Early/Late", keywords: [
    "Customer Complaint - Disconnected Issue","Early [before delivery window]","Early 1 day","Failed Verification",
    "Late [after delivery window]","Manager Call Back / Customer Resolutions","No ETA","Replacement","Rolled 1 day","Rolled 2 day","CC Error"
  ]},
  { name: "Complaint - Logistics - Failed delivery", keywords: [
    "Contacted","Customer Complaint - Disconnected Issue","Failed","Failed Verification","Manager Call Back / Customer Resolutions",
    "Misrouted","Missing Box","No Delivery","Non-Customer Received a Box","Not Contacted","Production Error","Replacement","Stolen","CC Error"
  ]},
  { name: "Complaint - Website / App / Internal Tech Error", keywords: [
    "App","BOB","Changes not applied","Customer Complaint - Disconnected Issue","Failed Verification","Glitchy","Internal",
    "Internet","iOS","Manager Call Back / Customer Resolutions","PureCloud","Safari / Internet Explorer / Chrome",
    "System Outage","Website","appcookbook","CC Error"
  ]},
  { name: "Marketing - Applying Voucher / Gift Card", keywords: [
    "CC error","Code Not Applied","Customer Complaint - Disconnected Issue","Expired","Failed Verification",
    "Free Add On For Life","Gift Card","Gift Card Confirmation","Manager Call Back / Customer Resolutions",
    "Manager Call Back / Escalation","Reactivation Code"
  ]},
  { name: "Marketing - Communication", keywords: [
    "3rd party","Affiliate","Amazon Prime","Catch & Cook","Collaboration","Customer Complaint - Disconnected Issue",
    "Direct Mail","Discount Offer","Door-to-door","Endorsement","Failed Verification","Gift card","HCF","ICO 2024",
    "Mailing list","Manager Call Back / Customer Resolutions","Multilevel","Not Received","Notification","Partnership",
    "Preferences","Promotion Education","Proposals","Referral","Terms & Conditions","Unsubscribe from Comms","CC Error"
  ]},
  { name: "Marketing - Referral", keywords: [
    "Exception","Failed Verification","Fraud","Freebie Fraud","Freebie Fraud Cancellation","Honored",
    "Manager Call Back / Customer Resolutions","Not Honoured","Previous Tenant","Voucher Fraud Cancellation","CC Error"
  ]},
  { name: "Other - Connection Issue", keywords: ["Call Disconnected","Response Not Visible","CC Error"] },
  { name: "Other - Non-customer query", keywords: [
    "BBB","Courier Proposal","Customer Complaint - Disconnected Issue","Event Invite","Failed Verification",
    "Fraud Cancelled Customer","General Inquiry","Job Application","Manager Call Back / Customer Resolutions",
    "Non-UK (HF/GC)","Passed On Details (call back from specific company employee)","Product Inquiry",
    "Supplier Proposal","Vendor Proposal","CC Error"
  ]},
  { name: "Other - Sustainability / Sourcing", keywords: [
    "Composting","Failed Verification","Free range","Halal","Ice pack disposal","Manager Call Back / Customer Resolutions",
    "Meat Alternative","Organic","Packaging","Plastic","Recycling","Supplier Inquiry","Waste","CC Error"
  ]},
  { name: "US ONLY: CISP Issue", keywords: ["CISP Report Submitted","Warning - Disconnected Issue","CC Error"] },
  { name: "Payments - Charge breakdown", keywords: [
    "Add-on / Extras","Amazon Prime","Charge Breakdown / Payment breakdown","Confirmed payment",
    "Customer Complaint - Disconnected Issue","Delivery Fee","Double Charge","Failed Verification","Incorrect Charge",
    "Invoice","Manager Call Back / Customer Resolutions","Premium","Premium Delivery","Price Change","Regional Fee",
    "Standard Shipping","Street Food","Surcharge","Ultimate","Unauthorised Charge","Unaware of Surcharge","CC Error"
  ]},
  { name: "Payments - Credit/ Refund", keywords: [
    "Balance","Credit","Credit Confirmation","Customer Complaint - Disconnected Issue",
    "Manager Call Back / Customer Resolutions","Refund","Top-Up","CC Error"
  ]},
  { name: "Payments - Outstanding / Dunning", keywords: [
    "Chargeback","Debt Collection","Dunning","Extension","Failed Payment","Insufficient Funds","Outstanding Balance","Overpaid",
    "Payment Method","Payments Schedule","Proof of Payment","Waive","Customer Complaint - Disconnected Issue",
    "Manager Call Back / Customer Resolutions","CC Error"
  ]}
];

const WRAP_HINTS_RAW = {
  "Complaint - Quality": {
    Issue: "Customer expects to have a full meal to be edible, but there was a quality concern with the ingredients.",
    resolution: "I process a credit."
  },
  "Complaint - Pick & Pack": {
    Issue: "Customer was expecting to have complete ingredients, but something in the box was missing or incorrect.",
    resolution: "I process a credit and adv NIA."
  },
  "Logistics - Delivery status": {
    Issue: "Customer expects to have the box delivered, but wanted an update on the delivery.",
    resolution: "I informed cx about the latest tracking update."
  },
  "Payments - Credit/ Refund": {
    Issue: "Customer expected to have a credit or refund on the account.",
    resolution: "I reviewed the account and informed cx of the correct payment outcome."
  },
  "Account - Cancellation - Customer Not Retained": {
    Issue: "Customer expected to have the account cancelled.",
    resolution: "I provided the appropriate offer per SOP, but customer still wanted to cancel the account."
  },
  "Account - Cancellation - Customer Retained": {
    Issue: "Customer expected to have the account cancelled.",
    resolution: "I provided the appropriate offer per SOP, and customer decided to stay."
  },
  "Account - Skip/Unskip": {
    Issue: "Customer expected the delivery schedule to be updated.",
    resolution: "I updated the schedule in OWL."
  },
  "Account -Update account / subscription details": {
    Issue: "Customer expected to update an account or delivery setting.",
    resolution: "I updated the account setting in OWL or advised the next steps."
  },
  "Account - Meal Swap / Recipe Preference": {
    Issue: "Customer expected to update meal choices or preferences on the account.",
    resolution: "I informed cx of the available options and updated the selection if eligible."
  },
  "Complaint - Food Safety": {
    Issue: "Customer expects to receive safe and edible meals, but raised a food safety concern.",
    resolution: "I reviewed the concern and handled it following food safety SOP."
  },
  "Complaint - Logistic - Courier company": {
    Issue: "Customer expected the courier to follow delivery instructions and handle the delivery properly.",
    resolution: "I submitted a report about the courier concern."
  },
  "Complaint - Logistics - Early/Late": {
    Issue: "Customer expects to have the box delivered within the correct time frame, but there was a timing issue.",
    resolution: "I informed cx of the tracking update and our SOP for deliveries."
  },
  "Complaint - Logistics - Failed delivery": {
    Issue: "Customer expects to have the box delivered, but the delivery failed or did not arrive.",
    resolution: "I reviewed the delivery status and provided the appropriate outcome."
  },
  "Complaint - Website / App / Internal Tech Error": {
    Issue: "Customer expected the system to work properly, but there was a website, app, or internal error.",
    resolution: "I informed cx that I will submit a report and gave troubleshooting steps if applicable."
  },
  "Marketing - Applying Voucher / Gift Card": {
    Issue: "Customer expected a gift card, voucher, or promo to apply on the account.",
    resolution: "I checked the promo details and informed cx of the correct outcome."
  },
  "Marketing - Communication": {
    Issue: "Customer expected support regarding a communication, promo, or notification concern.",
    resolution: "I informed cx of the correct promotion or communication details."
  },
  "Marketing - Referral": {
    Issue: "Customer expected the referral or referral benefit to apply correctly.",
    resolution: "I checked the referral details and informed cx of the correct outcome."
  },
  "Other - Connection Issue": {
    Issue: "No issue provided.",
    resolution: "No resolution provided."
  },
  "Other - Non-customer query": {
    Issue: "Customer contacted us for a general or non-standard inquiry.",
    resolution: "I informed cx of the appropriate information or next steps."
  },
  "Other - Sustainability / Sourcing": {
    Issue: "Customer expected information about sourcing or sustainability.",
    resolution: "I informed cx of the details available on the concern."
  },
  "US ONLY: CISP Issue": {
    Issue: "Customer contact involved a CISP-related issue.",
    resolution: "I followed the appropriate process for the CISP concern."
  },
  "Payments - Charge breakdown": {
    Issue: "Customer expected to know the charge details on the account.",
    resolution: "I informed cx of the payment breakdown."
  },
  "Payments - Outstanding / Dunning": {
    Issue: "Customer expected support for a failed payment or outstanding balance.",
    resolution: "I reviewed the payment status and informed cx of the next steps."
  },
  "Account - 1st Box Change / Question": {
    Issue: "Customer expected support for a first box change or question on the account.",
    resolution: "I reviewed the concern and informed cx of the available options."
  },
  "Account - After deadline change request": {
    Issue: "Customer expected a change on the order, but the request was already past the cut-off date.",
    resolution: "I educated cx about our cut-off date and the options available."
  },
  "Account - Cancellation - Duplicated Subscription": {
    Issue: "Customer expected the duplicate subscription to be cancelled or corrected.",
    resolution: "I reviewed the duplicate account concern and informed cx of the correct outcome."
  },
  "Account - Data Protection": {
    Issue: "Customer expected support for a data or privacy-related request.",
    resolution: "I informed cx of the next steps for the data request."
  },
  "Account - Loyalty Program": {
    Issue: "Customer expected support regarding the loyalty program.",
    resolution: "I informed cx of the loyalty program details."
  },
  "Account - Reactivation": {
    Issue: "Customer expected the account to be reactivated.",
    resolution: "I informed cx of the reactivation steps or outcome."
  }
};

export const WRAP_HINTS = cleanHintMap(WRAP_HINTS_RAW);

const KEYWORD_HINTS_RAW = {
  "Marked Delivered - Not received": {
    Issue: "Customer expects to have the box delivered, but no box on the area.",
    resolution: "I process a credit and refund the shipping fee."
  },
  "Failed": {
    Issue: "Customer expects to have the box delivered, but the tracking says Failure.",
    resolution: "I process a credit and refund the shipping fee."
  },
  "No Tracking Link Received": {
    Issue: "Customer expects to have the box delivered, but no update on tracking link.",
    resolution: "I process a credit and refund the shipping fee."
  },
  "Late [after delivery window]": {
    Issue: "Customer expects to have the box delivered, but the box was still delayed after 8pm.",
    resolution: "Customer wanted a refund and I educate that we are unable to process it."
  },
  "Delivery Status Check": {
    Issue: "Customer expects to have the box delivered, but customer wanted to ask the status of the delivery.",
    resolution: "I informed the customer that it is still in transit."
  },
  "Rolled 2 day": {
    Issue: "Customer expects to have the box delivered, but customer didn't receive the box.",
    resolution: "I process a credit and refund the shipping fee."
  },
  "Rolled 1 day": {
    Issue: "Customer expected to have the box delivered on time, but the box was a day late.",
    resolution: "I informed cx that the box was now out for delivery and gave the time frame from the tracking. I also gave our SOP for deliveries."
  },
  "Where Is My Box?": {
    Issue: "Customer expects to have the box delivered, but no update on tracking link.",
    resolution: "I informed cx on how our SOP for deliveries."
  },
  "No Delivery": {
    Issue: "Customer expects to have the box delivered, but no update on tracking link.",
    resolution: "I process a credit and refund the shipping fee."
  },
  "Misrouted": {
    Issue: "Customer expects to have the box delivered, but it was delivered to the wrong address.",
    resolution: "I process a credit and refund the shipping fee."
  },
  "Leave Safe / Delivery Instructions": {
    Issue: "Customer expected to have instructions on the deliveries.",
    resolution: "I informed cx that I will put instructions on the account."
  },
  "Early [before delivery window]": {
    Issue: "Customer expects to have the box delivered from 8am - 8pm, but it was delivered earlier.",
    resolution: "I informed cx that I will submit a report about this."
  },
  "Early 1 day": {
    Issue: "Customer expects to have the box delivered on time.",
    resolution: "I informed cx that due to weather conditions they delivered the box early."
  },
  "Missing Box": {
    Issue: "Customer expects to have the box delivered, but no box on the area.",
    resolution: "I process a credit and refund the shipping fee."
  },

  "Missing": {
    Issue: "Customer was expecting to have complete ingredients, but ingredients for one meal were missing.",
    resolution: "I process a credit and adv NIA."
  },
  "Incorrect": {
    Issue: "Customer expects to have a complete meal, but one meal is incorrect.",
    resolution: "I process a refund since there is a long time discount and adv NIA."
  },
  "Missing Recipe Card": {
    Issue: "Customer expected to have a complete recipe card, but there is one missing.",
    resolution: "I emailed the recipe card and adv NIA."
  },

  "Damage": {
    Issue: "Customer expects to have a full meal to be edible, but all the ingredients of one meal were damaged.",
    resolution: "I process a credit."
  },
  "Leaking / Spilled": {
    Issue: "Customer expects to have a full meal to be edible, but ingredients were damaged.",
    resolution: "I process a credit."
  },
  "Poor Value Perception": {
    Issue: "Customer expects to have a full meal to be edible, but some of the ingredients are not up to cx standards.",
    resolution: "I process a credit."
  },
  "Warm": {
    Issue: "Customer expects to have a full meal to be edible, but all the ingredients were thawed.",
    resolution: "I process a credit."
  },
  "Rotten": {
    Issue: "Customer expects to have a full meal to be edible, but all the ingredients for the meals were rotten.",
    resolution: "I process a credit."
  },
  "Frozen": {
    Issue: "Customer expects to have a full meal to be edible, but ingredients for the meals were frozen.",
    resolution: "I process a credit."
  },

  "Skip - No reason provided": {
    Issue: "Customer expects the next delivery to be skipped.",
    resolution: "I skipped it in OWL."
  },
  "Skip - Can't afford": {
    Issue: "Customer expects the next delivery to be skipped because of the price.",
    resolution: "I skipped it in OWL."
  },
  "Skip - On vacation": {
    Issue: "Customer expects the next delivery to be skipped because they will be away.",
    resolution: "I skipped it in OWL."
  },
  "Unskip": {
    Issue: "Customer expects the skipped delivery to be put back on the account.",
    resolution: "I unskipped the delivery in OWL."
  },

  "Can't Afford / Out of Budget": {
    Issue: "Customer expected to have the account cancelled since the meals are expensive.",
    resolution: "Offer to change the plan size or change the delivery interval, but customer still wanted to cancel the account."
  },
  "Account Management Issues": {
    Issue: "Customer expected the account settings to stay the same, but there was an account management issue.",
    resolution: "I offered the available options, but customer still wanted to cancel the account."
  },
  "Duplicate Account": {
    Issue: "Customer expected this delivery to be cancelled.",
    resolution: "I informed cx that the account was not cancelled."
  },
  "Duplicate Cancellation": {
    Issue: "Customer expected this delivery to be cancelled.",
    resolution: "I informed cx that the account was not cancelled."
  },
  "Delivery Issues": {
    Issue: "Customer expects to receive edible meals, but cx had damaged meals for past deliveries.",
    resolution: "I educate that we can skip 3 weeks, but customer still wanted to cancel the account."
  },
  "No Reason Provided": {
    Issue: "Customer expected to have the account cancelled.",
    resolution: "I offered to skip at least 3 weeks and offered a monetary amount, but customer still wanted to cancel."
  },
  "Cancellation - [Insert reason]": {
    Issue: "Customer expected to have the account cancelled.",
    resolution: "I reviewed the concern and customer still wanted to cancel the account."
  },
  "Cancellation - Delivery issues": {
    Issue: "Customer expected to have the account cancelled because of delivery issues.",
    resolution: "I provided the available options, but customer still wanted to cancel the account."
  },
  "Cancellation - Don't like meals": {
    Issue: "Customer expected to have the account cancelled since the meals are not up to cx standards.",
    resolution: "I offered meal options or alternatives, but customer still wanted to cancel the account."
  },
  "Cancellation - Don't like the meal/s": {
    Issue: "Customer expected to have the account cancelled since the meals are not up to cx standards.",
    resolution: "I offered meal options or alternatives, but customer still wanted to cancel the account."
  },
  "Cancellation - Don't like the service": {
    Issue: "Customer expected to have the account cancelled because they were not happy with the service.",
    resolution: "I reviewed the concern and customer still wanted to cancel the account."
  },
  "Cancellation - Didn't mean to order": {
    Issue: "Customer expects the box to be cancelled because the order was not intended.",
    resolution: "I educate cx about our cut-off date."
  },
  "Cancellation - Missed deadline": {
    Issue: "Customer expected to have the box cancelled since customer was unaware of this.",
    resolution: "I educated cx that we are unable to cancel the box since we are already past the cut-off date."
  },
  "Cancellation - Price": {
    Issue: "Customer expected to have the account cancelled since the meals are expensive.",
    resolution: "I offered plan size or delivery interval changes, but customer still wanted to cancel the account."
  },
  "Cancellation - Quality issues": {
    Issue: "Customer expected to have the account cancelled because of quality concerns with the meals.",
    resolution: "I reviewed the concern and customer still wanted to cancel the account."
  },
  "Cancellation - Trial box only": {
    Issue: "Customer expected to stop after the trial or first box only.",
    resolution: "I reviewed the account and processed the appropriate cancellation outcome."
  },

  "Refund": {
    Issue: "Customer expects to have a refund.",
    resolution: "I reviewed the account and informed cx of the refund outcome."
  },
  "Credit": {
    Issue: "Customer expected to have a credit on the account.",
    resolution: "I educated cx when it will be applied or informed cx that I will process the credit."
  },
  "Credit Confirmation": {
    Issue: "Customer expected to confirm that the credit is already on the account.",
    resolution: "I informed cx that the credit was already applied and when it will be used."
  },
  "Balance": {
    Issue: "Customer expected to know the credit or balance on the account.",
    resolution: "I informed cx how the credit applies on the account."
  },
  "Top-Up": {
    Issue: "Customer expected support regarding the account balance or top-up.",
    resolution: "I reviewed the account and informed cx of the balance outcome."
  },
  "Failed Payment": {
    Issue: "Customer expected that the payment pushed through and wanted to pay for the delivery.",
    resolution: "I informed cx that we are unable to process a payment since we have at least 5 days prior to the delivery to make any changes to the account."
  },
  "Insufficient Funds": {
    Issue: "Customer expected that the payment pushed through and wanted to pay the delivery.",
    resolution: "I informed cx that we are unable to process a payment since we have at least 5 days prior to the delivery to make any changes to the account."
  },
  "Outstanding Balance": {
    Issue: "Customer expects to cancel the pending payment status.",
    resolution: "I cancelled the pending payment status."
  },
  "Payments Schedule": {
    Issue: "Customer wanted to set a schedule for the payments.",
    resolution: "I educate cx that we don't have that option since we have a cut-off date to be followed."
  },
  "Confirmed payment": {
    Issue: "Customer expects to have the account checked since there was a payment processed.",
    resolution: "I educate cx that there was a delivery."
  },
  "Payment Method Change": {
    Issue: "Customer expected to change the payment method.",
    resolution: "I informed cx that the payment method was already changed."
  },
  "Invoice": {
    Issue: "Customer expects to have a detailed breakdown of the payment.",
    resolution: "I informed cx that I will send an invoice receipt."
  },
  "Overpaid": {
    Issue: "Customer expected to have one delivery, but got another delivery charged on the account.",
    resolution: "I informed cx that I will submit a report and process a refund."
  },
  "Surcharge": {
    Issue: "Customer expected to know the extra charge on the account.",
    resolution: "I informed cx that there was a premium meal for this delivery."
  },
  "Payment Method": {
    Issue: "Customer expected to have the payment method removed.",
    resolution: "I informed cx that I submitted the report."
  },
  "Charge Breakdown / Payment breakdown": {
    Issue: "Customer expected to know if there was a charge on the account.",
    resolution: "I informed cx of the correct charge details."
  },
  "Chargeback": {
    Issue: "Customer expected to have a refund.",
    resolution: "I informed cx that the charge may have been disputed with the bank and we are unable to process a refund."
  },

  "Promotion Education": {
    Issue: "Customer expected support regarding the promotion on the account.",
    resolution: "I informed cx of the promotion details or the correct promo outcome."
  },
  "Code Not Applied": {
    Issue: "Customer expects to have a promotion on the account, but it wasn't applied.",
    resolution: "I informed cx that there was an error about this, and I applied a promotion on the account."
  },
  "Expired": {
    Issue: "Customer expects to have a promotion, but the one on the account is expired.",
    resolution: "I informed cx that we don't have any promotions that we can offer."
  },
  "Free Add On For Life": {
    Issue: "Customer expected to have the promotion for free add-ons for life.",
    resolution: "I informed cx on how to select it."
  },
  "Referral": {
    Issue: "Customer expected the referral benefit to apply on the account.",
    resolution: "I informed cx of the referral details on the account."
  },
  "Partnership": {
    Issue: "Customer expected to have an email or promo from a partnership offer.",
    resolution: "I informed cx how to redeem it."
  },
  "Gift Card": {
    Issue: "Customer expected to have the gift card redeemed.",
    resolution: "I informed cx of the gift card outcome and processed support if applicable."
  },
  "Gift Card Confirmation": {
    Issue: "Customer expected confirmation about the gift card or how it was applied.",
    resolution: "I informed cx of the gift card details."
  },
  "Reactivation Code": {
    Issue: "Customer expected support regarding the reactivation code.",
    resolution: "I informed cx of the promo details and next steps."
  },

  "Response Not Visible": {
    Issue: "No issue provided.",
    resolution: "No resolution provided since cx went inactive."
  },
  "How To": {
    Issue: "Customer expected guidance on how to complete an account action.",
    resolution: "I informed cx of the steps or updated it in OWL if applicable."
  },
  "How to": {
    Issue: "Customer expected guidance on how to complete an account action.",
    resolution: "I informed cx of the steps or updated it in OWL if applicable."
  },
  "Call Disconnected": {
    Issue: "No issue provided.",
    resolution: "No resolution provided since cx went inactive on the call."
  },
  "Failed Verification": {
    Issue: "Customer expected support on the account, but verification could not be completed.",
    resolution: "I checked the necessary verification and informed cx of the correct next steps."
  },
  "Follow Up": {
    Issue: "Customer expected an update on a previously raised concern.",
    resolution: "I informed cx of the latest account status or that the concern was already resolved."
  },
  "Recipe Inquiry": {
    Issue: "Customer expected to know more details about a recipe.",
    resolution: "I informed cx of the recipe details needed."
  },
  "General Inquiry": {
    Issue: "Customer expected information or an update about the concern.",
    resolution: "I informed cx of the details available."
  },
  "Nutritional Information": {
    Issue: "Customer expected to know more details about the nutrition or calories per serving.",
    resolution: "I informed cx of the nutrition details needed."
  },

  "Non-UK (HF/GC)": {
    Issue: "Customer wanted support on an account outside our region.",
    resolution: "I informed cx that we are unable to assist."
  },
  "Event Invite": {
    Issue: "No issue since it is irrelevant.",
    resolution: "No resolution provided."
  },
  "Password Reset": {
    Issue: "Customer expected to have access to the account.",
    resolution: "I sent a reset password link."
  },
  "Delivery Address Change": {
    Issue: "Customer expects the box to be delivered to the exact address.",
    resolution: "I informed cx that the address is correct."
  },
  "1st Order Confirmation": {
    Issue: "Customer expected to have the first delivery on a specific date.",
    resolution: "I informed cx of the correct first order status."
  },
  "Meat Alternative": {
    Issue: "Customer doesn't want pork or wants a meat alternative on the deliveries.",
    resolution: "I educate cx that the meats need to be selected on their end."
  },
  "Data Deletion": {
    Issue: "Customer expected to have the data deleted.",
    resolution: "I informed cx that we will delete the data."
  },
  "Email Address Update": {
    Issue: "Customer expected to have the email address changed.",
    resolution: "I changed the email address in OWL."
  },
  "Meal Selection / Menu / Recipes": {
    Issue: "Customer expected to see what the meals are on the upcoming delivery.",
    resolution: "I informed cx of the meals for that delivery."
  },
  "Delivery Day": {
    Issue: "Customer expects the delivery on a different date.",
    resolution: "I informed cx that I changed it in OWL."
  },
  "Change - Meal swap": {
    Issue: "Customer expected to change the meals for the upcoming delivery.",
    resolution: "I informed cx of the meals for that delivery and changed it in OWL."
  },
  "Change Delivery Address (for a specific box)": {
    Issue: "Customer expected to have the delivery on the exact address.",
    resolution: "I informed cx that we are unable to do it because it is already past the cut-off date."
  },
  "Change Address (for a specific box)": {
    Issue: "Customer expected to have the delivery on the exact address.",
    resolution: "I informed cx that we are unable to do it because it is already past the cut-off date."
  },
  "Change Delivery Day": {
    Issue: "Customer expected to have the delivery on a different day.",
    resolution: "I informed cx of the available outcome based on the cut-off date."
  },
  "Change Delivery window": {
    Issue: "Customer expected to have the box delivered on another day or window.",
    resolution: "I educated cx that we are unable to move this since we are already past the cut-off date."
  },
  "Change Box type": {
    Issue: "Customer expected to change the box type on the account.",
    resolution: "I informed cx of the available options for the box type."
  },
  "Change Box Type": {
    Issue: "Customer expected to change the box type on the account.",
    resolution: "I informed cx of the available options for the box type."
  },
  "Change Meal Size": {
    Issue: "Customer expected to change the meal size.",
    resolution: "I informed cx that I successfully changed the plan size."
  },
  "App": {
    Issue: "Customer expected the app to be working, but cx was unable to log in to the account.",
    resolution: "I informed cx that I will submit a report and gave troubleshooting steps."
  },
  "Ingredient Inquiry": {
    Issue: "Customer expected to know how the ingredients are used or divided.",
    resolution: "I informed cx of the ingredient details needed."
  },
  "Unsubscribe from Comms": {
    Issue: "Customer expected to be removed from communications.",
    resolution: "I informed cx of the correct unsubscribe steps or sent the link."
  },
  "Preference": {
    Issue: "Customer expected to update menu or meal preferences on the account.",
    resolution: "I informed cx how the preferences can be updated."
  },
  "Add On": {
    Issue: "Customer expected support regarding add-ons on the account.",
    resolution: "I informed cx of the add-on details and next steps."
  },
  "Recipe Copy Request (PDF)": {
    Issue: "Customer expected to have a copy of the recipe.",
    resolution: "I informed cx how to access the recipe or sent the appropriate details."
  },

  "CC Error": {
    Issue: "Customer contact involved a CC error on the account or prior handling.",
    resolution: "I reviewed the account and provided the correct support outcome."
  },
  "CC error": {
    Issue: "Customer contact involved a CC error on the account or prior handling.",
    resolution: "I reviewed the account and provided the correct support outcome."
  },
  "CERT": {
    Issue: "Customer concern needed CERT handling.",
    resolution: "I followed the appropriate process for the concern."
  },
  "Customer Complaint - Disconnected Issue": {
    Issue: "Customer raised a complaint, but the interaction got disconnected.",
    resolution: "I reviewed the interrupted concern and provided the appropriate outcome."
  },
  "Customer Complaint - DisconnectedIssue": {
    Issue: "Customer raised a complaint, but the interaction got disconnected.",
    resolution: "I reviewed the interrupted concern and provided the appropriate outcome."
  },
  "Customer Complaint - DisconnectedInteraction": {
    Issue: "Customer raised a complaint, but the interaction got disconnected.",
    resolution: "I reviewed the interrupted concern and provided the appropriate outcome."
  },
  "Manager Call Back / Customer Resolutions": {
    Issue: "Customer wanted additional support or resolution from higher support handling.",
    resolution: "I informed cx of the appropriate escalation or callback outcome."
  },
  "Manager Call Back / Escalation": {
    Issue: "Customer wanted the case to be escalated.",
    resolution: "I informed cx of the escalation or callback outcome."
  }
};

export const KEYWORD_HINTS = cleanHintMap(KEYWORD_HINTS_RAW);

export const NIA_LIBRARY = {
  "Account - Cancellation - Customer Not Retained": {
    "Can't Afford / Out of Budget": {
      hf: `To cancel your subscription with HelloFresh via website:
1. Log in on the HelloFresh website.
2. Click on 'Your Account Settings'.
3. Click the small edit box under 'Subscription Info'.
4. Click on 'cancel my subscription' at the bottom of the page.
5. Follow the steps to deactivate.`,
      everyplate: `We hate to let you go, but as requested, I cancelled your EveryPlate subscription and any future boxes. You will be receiving a confirmation on your email regarding the cancellation. If there's anything we can do to encourage you cooking with us in the future, please don’t hesitate to let us know.

If you do choose to reactivate your subscription, here are some simple instructions to do so:
- Log in to your EveryPlate account
- You will automatically be directed to 'Plan Settings'
- Select 'Reactivate'`,
      general: `To cancel your subscription with XXX via website:
1. Log in on the XXX website.
2. Click on 'Your Account Settings'.
3. Click the small edit box under 'Subscription Info' or open Plan Settings.
4. Click on 'cancel my subscription' or the cancellation option at the bottom of the page.
5. Follow the steps to deactivate.`
    },
    "Cancellation - [Insert reason]": {
      hf: `To cancel your subscription with HelloFresh via website:
1. Log in on the HelloFresh website.
2. Click on 'Your Account Settings'.
3. Click the small edit box under 'Subscription Info'.
4. Click on 'cancel my subscription' at the bottom of the page.
5. Follow the steps to deactivate.`,
      everyplate: `We hate to let you go, but as requested, I cancelled your EveryPlate subscription and any future boxes. You will be receiving a confirmation on your email regarding the cancellation. If there's anything we can do to encourage you cooking with us in the future, please don’t hesitate to let us know.

If you do choose to reactivate your subscription, here are some simple instructions to do so:
- Log in to your EveryPlate account
- You will automatically be directed to 'Plan Settings'
- Select 'Reactivate'`,
      general: `To cancel your subscription with XXX via website:
1. Log in on the XXX website.
2. Click on 'Your Account Settings'.
3. Click the small edit box under 'Subscription Info' or open Plan Settings.
4. Click on 'cancel my subscription' or the cancellation option at the bottom of the page.
5. Follow the steps to deactivate.`
    },
    "No Reason Provided": {
      hf: `To cancel your subscription with HelloFresh via website:
1. Log in on the HelloFresh website.
2. Click on 'Your Account Settings'.
3. Click the small edit box under 'Subscription Info'.
4. Click on 'cancel my subscription' at the bottom of the page.
5. Follow the steps to deactivate.`,
      everyplate: `We hate to let you go, but as requested, I cancelled your EveryPlate subscription and any future boxes. You will be receiving a confirmation on your email regarding the cancellation. If there's anything we can do to encourage you cooking with us in the future, please don’t hesitate to let us know.

If you do choose to reactivate your subscription, here are some simple instructions to do so:
- Log in to your EveryPlate account
- You will automatically be directed to 'Plan Settings'
- Select 'Reactivate'`,
      general: `To cancel your subscription with XXX via website:
1. Log in on the XXX website.
2. Click on 'Your Account Settings'.
3. Click the small edit box under 'Subscription Info' or open Plan Settings.
4. Click on 'cancel my subscription' or the cancellation option at the bottom of the page.
5. Follow the steps to deactivate.`
    },
    "Trial Box": {
      hf: `To cancel your subscription with HelloFresh via website:
1. Log in on the HelloFresh website.
2. Click on 'Your Account Settings'.
3. Click the small edit box under 'Subscription Info'.
4. Click on 'cancel my subscription' at the bottom of the page.
5. Follow the steps to deactivate.`,
      everyplate: `We hate to let you go, but as requested, I cancelled your EveryPlate subscription and any future boxes. You will be receiving a confirmation on your email regarding the cancellation. If there's anything we can do to encourage you cooking with us in the future, please don’t hesitate to let us know.

If you do choose to reactivate your subscription, here are some simple instructions to do so:
- Log in to your EveryPlate account
- You will automatically be directed to 'Plan Settings'
- Select 'Reactivate'`,
      general: `To cancel your subscription with XXX via website:
1. Log in on the XXX website.
2. Click on 'Your Account Settings'.
3. Click the small edit box under 'Subscription Info' or open Plan Settings.
4. Click on 'cancel my subscription' or the cancellation option at the bottom of the page.
5. Follow the steps to deactivate.`
    },
    "Unaware of Subscription": {
      hf: `To cancel your subscription with HelloFresh via website:
1. Log in on the HelloFresh website.
2. Click on 'Your Account Settings'.
3. Click the small edit box under 'Subscription Info'.
4. Click on 'cancel my subscription' at the bottom of the page.
5. Follow the steps to deactivate.`,
      everyplate: `We hate to let you go, but as requested, I cancelled your EveryPlate subscription and any future boxes. You will be receiving a confirmation on your email regarding the cancellation. If there's anything we can do to encourage you cooking with us in the future, please don’t hesitate to let us know.

If you do choose to reactivate your subscription, here are some simple instructions to do so:
- Log in to your EveryPlate account
- You will automatically be directed to 'Plan Settings'
- Select 'Reactivate'`,
      general: `To cancel your subscription with XXX via website:
1. Log in on the XXX website.
2. Click on 'Your Account Settings'.
3. Click the small edit box under 'Subscription Info' or open Plan Settings.
4. Click on 'cancel my subscription' or the cancellation option at the bottom of the page.
5. Follow the steps to deactivate.`
    }
  },

  "Account - Skip/Unskip": {
    "Skip - Can't afford": {
      hf: `In case you need to skip another week. You can easily do this on your account:

Here’s how:
1. Log in to your account.
2. Click on 'My Menu'.
3. Select the delivery day of the week you’d like to skip, then click 'Skip Week'.`,
      general: `In case you need to skip another week, you can easily do this on your account:

Here’s how:
1. Log in to your account.
2. Go to 'My Menu' or your delivery page.
3. Select the delivery week you’d like to skip, then click 'Skip Week'.`
    },
    "Skip - No reason provided": {
      hf: `In case you need to skip another week. You can easily do this on your account:

Here’s how:
1. Log in to your account.
2. Click on 'My Menu'.
3. Select the delivery day of the week you’d like to skip, then click 'Skip Week'.`,
      general: `In case you need to skip another week, you can easily do this on your account:

Here’s how:
1. Log in to your account.
2. Go to 'My Menu' or your delivery page.
3. Select the delivery week you’d like to skip, then click 'Skip Week'.`
    },
    "Skip - On vacation": {
      hf: `In case you need to skip another week. You can easily do this on your account:

Here’s how:
1. Log in to your account.
2. Click on 'My Menu'.
3. Select the delivery day of the week you’d like to skip, then click 'Skip Week'.`,
      general: `In case you need to skip another week, you can easily do this on your account:

Here’s how:
1. Log in to your account.
2. Go to 'My Menu' or your delivery page.
3. Select the delivery week you’d like to skip, then click 'Skip Week'.`
    }
  },

  "Marketing - Communication": {
    "Preferences": {
      hf: `All active customers can receive a meal selection email reminder. Just follow these steps to update your email preferences:

1. Log into your HelloFresh Account.
2. Click on your name on the upper right hand corner and click on "Account Settings" and then choose "Notification Settings".
3. Make your selection to subscribe or unsubscribe from certain email communications from HelloFresh.`,
      general: `All active customers can receive a meal selection email reminder. Just follow these steps to update your email preferences:

1. Log into your XXX account.
2. Go to Account Settings.
3. Open Notification Settings.
4. Make your selection to subscribe or unsubscribe from certain email communications.`
    },
    "Unsubscribe from Comms": {
      hf: `1. Log in to your account.
2. Click on your name in the upper-right hand corner and choose 'Account Settings'.
3. Select 'Notification Settings'.
4. Make your changes to subscribe or unsubscribe from certain emails.`,
      general: `1. Log in to your account.
2. Go to Account Settings.
3. Select 'Notification Settings' or email preferences.
4. Make your changes to subscribe or unsubscribe from certain emails.`
    }
  },

  "Account -Update account / subscription details": {
    "Email Address Update": {
      hf: `You can update your email address by following the steps below:

1. Log in to your account.
2. Click on your name in the upper right-hand corner and head to your Account Settings.
3. Select 'Account Info'.
4. Click 'Edit' on 'Personal Info'.
5. Make the necessary changes and click 'Save'.`,
      general: `You can update your email address by following the steps below:

1. Log in to your account.
2. Go to your Account Settings.
3. Select 'Account Info' or 'Personal Info'.
4. Click 'Edit'.
5. Make the necessary changes and click 'Save'.`
    },
    "Password Reset": {
      hf: `Alternatively, you may update your password through these simple steps:

1. Log in to your account.
2. Click on your name in the upper right-hand corner and choose 'Account Settings'.
3. Select 'Account Info'.
4. Click 'Edit' on 'Password'.
5. Make the necessary changes then click on 'Save' to confirm your choice.`,
      general: `Alternatively, you may update your password through these simple steps:

1. Log in to your account.
2. Go to 'Account Settings'.
3. Select 'Account Info' or 'Login Details'.
4. Click 'Edit' on 'Password'.
5. Make the necessary changes then click 'Save'.`
    },
    "Change Meal Size": {
      hf: `1. Log in to your account.
2. Go to 'My Menu' for the week you want to switch the plan.
3. Click on 'Edit Delivery'.
4. You will see the option 'Change Box Size'.
5. You can now select the 'Number of People' and the 'Number of Meals'.
6. Select your meals and extras.
7. Click 'Save'.`,
      general: `1. Log in to your account.
2. Go to your menu or delivery page.
3. Click 'Edit Delivery' or plan settings.
4. Change your box size, number of people, or number of meals.
5. Save your changes.`
    },
    "Delivery Address Change": {
      hf: `You may follow the steps below in changing your delivery address successfully. This will apply on your upcoming delivery. Just a friendly reminder to update your address 5 days before the delivery date.

1. Log in to your account.
2. Click on your name in the upper right-hand corner and head to your Account Settings.
3. Select 'Plan Settings'.
4. Scroll down to 'Delivery and payment'.
5. Click 'Edit' on 'Delivery Address'.
6. You can also add any special 'Delivery Instructions' for the delivery driver to follow.
7. Make the necessary changes and click 'Save'.`,
      general: `You may follow the steps below in changing your delivery address successfully:

1. Log in to your account.
2. Go to Account Settings or Plan Settings.
3. Open the delivery section.
4. Edit your delivery address and instructions.
5. Save your changes.`
    },
    "Leave Safe / Delivery Instructions": {
      hf: `You may follow the steps below:

1. Log in to your account.
2. Click on your name in the upper right-hand corner and head to your Account Settings.
3. Select 'Plan Settings'.
4. Scroll down to 'Delivery and payment'.
5. Click 'Edit' on 'Delivery Address'.
6. You can also add any special 'Delivery Instructions' for the delivery driver to follow.
7. Make the necessary changes and click 'Save'.`,
      general: `You may follow the steps below:

1. Log in to your account.
2. Go to Account Settings or Plan Settings.
3. Open the delivery section.
4. Edit your address or delivery instructions.
5. Save your changes.`
    },
    "Delivery Day": {
      hf: `1. Log in to your account.
2. Click on your name in the upper right-hand corner and head to your Account Settings.
3. Scroll down to the 'Delivery and payment' section.
4. Click 'Edit' next to 'Delivery window' option, then select your desired delivery day.
5. Click 'Save'.`,
      general: `1. Log in to your account.
2. Go to Account Settings or Plan Settings.
3. Open the delivery section.
4. Edit your delivery day or delivery window.
5. Click 'Save'.`
    },
    "Payment Method Change": {
      hf: `Alternatively, you may follow the steps below:

1. Log in to your account.
2. Click on your name in the upper right-hand corner and select Account Settings from the drop-down menu.
3. Scroll down to 'Payment Methods' on the Plan Settings page.
4. Alternatively, you can select 'Payment Methods' from the option on the left.
5. Select 'Change Payment Method'.
6. Click 'Add'.
7. Enter new payment information, click 'Add' then click 'Save'.`,
      general: `Alternatively, you may follow the steps below:

1. Log in to your account.
2. Go to Account Settings or Plan Settings.
3. Open Payment Methods.
4. Select Change Payment Method or Add Payment Method.
5. Enter your new payment information and save.`
    }
  },

  "Account - Meal Swap / Recipe Preference": {
    "Preference": {
      hf: `1. Log in to your account on the app.
2. Click on the 'Settings' icon at the bottom right-hand corner.
3. Click on 'Plan Settings' and select the plan you would like to update.
4. Click 'Menu Preferences' then select your desired preference.
5. A pop up will appear for you to confirm your preferences. Click 'Confirm'.
6. Click the back arrow in the upper left-hand corner.`,
      general: `1. Log in to your account.
2. Open Settings or Plan Settings.
3. Select Menu Preferences.
4. Choose your desired preference.
5. Confirm and save your changes.`
    },
    "Meal Swap": {
      hf: `1. Log into your account and click on 'My Menu'.
2. Navigate to the delivery week whose menu you'd like to change by clicking on the arrow buttons.
3. If you'd like to switch one meal for another, remove the selected meal by clicking the 'minus' button and add the meal you'd like to receive by clicking the 'add' button.
4. You may add additional meals by clicking on 'Add Extra Meal' below the recipe photo.
5. Click 'Save'.
6. Select any extras you would like to add, if any.
7. You will now see a message confirming your meal selection has been saved.
8. If you’re not in love with any of the recipes, you can easily skip that week’s delivery by clicking 'Skip this Week' in the 'Edit Delivery' tab above the menu.`,
      general: `1. Log into your account and click on 'My Menu'.
2. Navigate to the delivery week whose menu you'd like to change.
3. Remove the selected meal and add the meal you'd like instead.
4. Click 'Save'.`
    },
    "Recipe Copy Request (PDF)": {
      hf: `Recipe cards for your selected meals will come in your weekly delivery. You may also download them by accessing the "My Menu" page.

1. Click on "My Menu".
2. Click the picture of the recipe.
3. Click "See full recipe".
4. When the recipe opens click the down arrow to download.`,
      general: `Recipe cards for your selected meals may be available in your account.

1. Click on "My Menu".
2. Open the recipe.
3. Click "See full recipe".
4. Download the recipe if the option is available.`
    },
    "Nutritional Information": {
      hf: `Here is how to find it:

1. Log in to your account.
2. Click on 'My Menu'.
3. Click on an image of a meal that you would like to get nutritional information on.
4. A pop-up window will appear, select 'See Full Recipe' from the bottom.
5. In a new window, the nutrition information will be located to the right of the ingredients list.
6. The nutrition information provided is based on a per-serving amount.`,
      general: `Here is how to find it:

1. Log in to your account.
2. Go to 'My Menu'.
3. Open the meal you would like information on.
4. Select 'See Full Recipe' if available.
5. Nutrition information is usually found near the ingredients or recipe details.`
    },
    "Meal Selection / Menu / Recipes": {
      hf: `1. Log into your account and click on 'My Menu'.
2. Navigate to the delivery week whose menu you'd like to change by clicking on the arrow buttons.
3. If you'd like to switch one meal for another, remove the selected meal and add the meal you'd like to receive.
4. Click 'Save'.`,
      general: `1. Log into your account and click on 'My Menu'.
2. Navigate to the week you'd like to manage.
3. Update your selected meals.
4. Click 'Save'.`
    }
  },

  "Complaint - Pick & Pack": {
    "Missing": {
      hf: `For your own convenience in the future, you are also able to submit a report for missing/damaged ingredients on your end to save yourself some time.

1. You would navigate to the 'Contact Us' page on our app/website and click 'Report an Error'.
2. Once you have clicked there you will be able to select which box, meal, and ingredient is damaged/missing.
3. After that you will be able to submit your report and automatically have a credit applied to your HelloFresh account for each item in your report.
4. You are only able to report up to 3 ingredients in this manner however, as after that you will be prompted to contact us.`,
      general: `For your own convenience in the future, you may be able to submit a report for missing or damaged ingredients on your end to save time.

1. Navigate to the 'Contact Us' page on the app/website and click 'Report an Error' if available.
2. Select which box, meal, and ingredient is damaged or missing.
3. Submit your report to receive the applicable outcome.
4. If the issue is above the self-service limit, you may be prompted to contact support.`
    },
    "Incorrect": {
      hf: `For your own convenience in the future, you are also able to submit a report for missing/damaged ingredients on your end to save yourself some time.

1. You would navigate to the 'Contact Us' page on our app/website and click 'Report an Error'.
2. Once you have clicked there you will be able to select which box, meal, and ingredient is damaged/missing.
3. After that you will be able to submit your report and automatically have a credit applied to your HelloFresh account for each item in your report.
4. You are only able to report up to 3 ingredients in this manner however, as after that you will be prompted to contact us.`,
      general: `For your own convenience in the future, you may be able to submit a self-report for incorrect, missing, or damaged ingredients through the app or website.`
    }
  },

  "Complaint - Quality": {
    "Damage": {
      hf: `For your own convenience in the future, you are also able to submit a report for missing/damaged ingredients on your end to save yourself some time.

1. You would navigate to the 'Contact Us' page on our app/website and click 'Report an Error'.
2. Once you have clicked there you will be able to select which box, meal, and ingredient is damaged/missing.
3. After that you will be able to submit your report and automatically have a credit applied to your HelloFresh account for each item in your report.
4. You are only able to report up to 3 ingredients in this manner however, as after that you will be prompted to contact us.`,
      general: `For your own convenience in the future, you may be able to submit a self-report for damaged ingredients through the app or website.

1. You would navigate to the 'Contact Us' page on our app/website and click 'Report an Error'.
2. Once you have clicked there you will be able to select which box, meal, and ingredient is damaged or missing.
3. After that you will be able to submit your report and automatically have the applicable outcome applied.
4. If the issue is above the self-service limit, you may be prompted to contact support.`
    },
    "Spoiled": {
      hf: `For your own convenience in the future, you are also able to submit a report for missing/damaged ingredients on your end to save yourself some time.

1. You would navigate to the 'Contact Us' page on our app/website and click 'Report an Error'.
2. Once you have clicked there you will be able to select which box, meal, and ingredient is damaged/missing.
3. After that you will be able to submit your report and automatically have a credit applied to your HelloFresh account for each item in your report.
4. You are only able to report up to 3 ingredients in this manner however, as after that you will be prompted to contact us.`,
      general: `For your own convenience in the future, you may be able to submit a self-report for spoiled ingredients through the app or website.`
    }
  },

  "Marketing - Applying Voucher / Gift Card": {
    "Gift Card": {
      hf: `So here's what you need to do to redeem your gift card:
1. Head to HelloFresh.com.
2. Click 'Gift Cards' from the menu at the top.
3. Click the 'Redeem gift card' link, you can also scroll to the bottom of the page and click 'Redeem a Gift Card'.
4. You will then be redirected to enter your code.`,
      general: `So here's what you need to do to redeem your gift card:
1. Head to the website.
2. Click 'Gift Cards' from the menu.
3. Click the option to redeem a gift card.
4. Enter your code and follow the prompts.`
    },
    "Gift Card Confirmation": {
      hf: `So here's what you need to do to redeem your gift card:
1. Head to HelloFresh.com.
2. Click 'Gift Cards' from the menu at the top.
3. Click the 'Redeem gift card' link, you can also scroll to the bottom of the page and click 'Redeem a Gift Card'.
4. You will then be redirected to enter your code.`,
      general: `To redeem or confirm your gift card:
1. Open the Gift Cards page.
2. Choose the redeem option.
3. Enter your code.
4. Follow the prompts shown on screen.`
    },
    "Code Not Applied": {
      hf: `All HelloFresh discounts can be redeemed during the checkout process.

REDEEM DISCOUNT CODE
1. Click 'Do You Have A Promo Code?' and a pop-up box will allow you to apply your code.
2. Under the Order Summary box on the right, you will see the adjusted price.`,
      general: `Discount codes can usually be redeemed during checkout.

1. Select the option to enter a promo code.
2. Apply your code.
3. Check the order summary for the adjusted price.`
    }
  },

  "Payments - Charge breakdown": {
    "Invoice": {
      hf: `Alternatively, you may follow the steps below:

1. Log in to your HelloFresh account and click on your name in the upper right-hand corner.
2. Head to your account settings.
3. Head to 'Order History' and there you can view all your previous orders and how much you were charged.
4. If you'd like us to send you an invoice simply click 'Send Invoice' next to the relevant order and we'll email it over to you.`,
      general: `To view or request an invoice:

1. Log in to your account.
2. Go to Account Settings.
3. Open Order History.
4. Select the relevant order and request or download the invoice if available.`
    },
    "Charge Breakdown / Payment breakdown": {
      hf: `VIEW ORDER HISTORY

1. Log in to your HelloFresh account.
2. Click on your name in the upper right-hand corner and head to your account settings.
3. Head to 'Order History' and there you can view all your previous orders and how much you were charged.
4. If you'd like us to send you an invoice simply click 'Send Invoice' next to the relevant order and we'll email it over to you.`,
      general: `To check your order history and charges:

1. Log in to your account.
2. Go to Account Settings.
3. Open Order History.
4. Review your previous orders and related charges.`
    }
  },

  "Payments - Credit/ Refund": {
    "Credit": {
      hf: `1. Log in to your HelloFresh account.
2. Click on your name in the upper right-hand corner and head to your Account Settings.
3. Select 'Account Info'.
4. Scroll down to 'Your Credit' to view the credit amount on your account.
5. This credit amount will automatically be applied towards your next scheduled delivery.

If you have both a discount code and a credit in your account, we'll apply the discount in full before issuing the credit.`,
      general: `1. Log in to your account.
2. Go to Account Settings.
3. Open Account Info or Credits.
4. View the available credit on your account.
5. Credit will usually apply automatically to your next eligible order.`
    },
    "Balance": {
      hf: `1. Log in to your HelloFresh account.
2. Click on your name in the upper right-hand corner and head to your Account Settings.
3. Select 'Account Info'.
4. Scroll down to 'Your Credit' to view the credit amount on your account.
5. This credit amount will automatically be applied towards your next scheduled delivery.`,
      general: `1. Log in to your account.
2. Go to Account Settings.
3. Open Account Info or Credit Balance.
4. View the credit amount on your account.`
    }
  }
};
