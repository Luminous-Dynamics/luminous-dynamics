const { Firestore } = require('@google-cloud/firestore');

async function setup() {
  try {
    const firestore = new Firestore();
    
    // Cathedral configuration
    await firestore.collection('cathedral-config').doc('axiom').set({
      name: 'Axiom Node',
      stage: 'cathedral',
      founded: new Date(),
      intention: 'Individual consciousness awakening',
      domain: 'axiom.mycelix.net',
      coherenceThreshold: 0.8,
      graduationRequirements: {
        minimumDays: 28,
        minimumCoherence: 0.8,
        requiredExperiences: ['meditation', 'connection', 'wisdom-seeking']
      }
    });
    
    console.log('✅ Cathedral configuration initialized');
    console.log('✅ Collections ready for consciousness');
    
  } catch (error) {
    console.error('Setup error:', error);
  }
}

setup();
