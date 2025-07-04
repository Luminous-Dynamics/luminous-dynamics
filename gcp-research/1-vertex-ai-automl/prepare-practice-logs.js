#!/usr/bin/env node

/**
 * 🧠 Prepare Practice Log Data for Vertex AI AutoML
 * 
 * Converts practice logs into JSONL format for training
 * a consciousness pattern recognition model
 */

const fs = require('fs').promises;
const path = require('path');

// Sample practice log data structure
const SAMPLE_PRACTICE_LOGS = [
    {
        practiceId: "practice-001",
        userId: "user-123",
        glyphId: "*1",
        glyphName: "First Presence",
        timestamp: "2025-01-02T10:00:00Z",
        duration: 180, // seconds
        experience: "Felt deeply grounded. The three breaths brought immediate calm. Noticed tension releasing from shoulders.",
        preCoherence: 68,
        postCoherence: 75,
        coherenceChange: 7,
        tags: ["grounding", "calm", "presence", "breath"],
        quality: "high" // Label for training
    },
    {
        practiceId: "practice-002",
        userId: "user-456",
        glyphId: "*3",
        glyphName: "Sacred Listening",
        timestamp: "2025-01-02T11:30:00Z",
        duration: 300,
        experience: "Hard to quiet mental chatter at first. After 2 minutes, found the deeper listening space. Heard birds I hadn't noticed.",
        preCoherence: 72,
        postCoherence: 78,
        coherenceChange: 6,
        tags: ["listening", "awareness", "nature", "mental-quiet"],
        quality: "medium"
    },
    {
        practiceId: "practice-003",
        userId: "user-789",
        glyphId: "*9",
        glyphName: "Tending the Field",
        timestamp: "2025-01-02T14:00:00Z",
        duration: 240,
        experience: "Brought my mother to mind with warm intention. Felt the connection across distance. Tears arose unexpectedly.",
        preCoherence: 70,
        postCoherence: 82,
        coherenceChange: 12,
        tags: ["connection", "love", "distance", "emotion", "field"],
        quality: "high"
    },
    {
        practiceId: "practice-004",
        userId: "user-234",
        glyphId: "*8",
        glyphName: "Pause Practice",
        timestamp: "2025-01-02T15:45:00Z",
        duration: 60,
        experience: "Quick practice during work stress. Just one breath but it shifted everything. Space appeared.",
        preCoherence: 65,
        postCoherence: 71,
        coherenceChange: 6,
        tags: ["pause", "work", "stress-relief", "space"],
        quality: "medium"
    },
    {
        practiceId: "practice-005",
        userId: "user-567",
        glyphId: "*1",
        glyphName: "First Presence",
        timestamp: "2025-01-02T08:00:00Z",
        duration: 120,
        experience: "Morning practice. Rushed through it. Mind already on the day ahead. Still helped somewhat.",
        preCoherence: 70,
        postCoherence: 72,
        coherenceChange: 2,
        tags: ["morning", "rushed", "distracted"],
        quality: "low"
    }
];

class PracticeLogProcessor {
    constructor() {
        this.outputDir = path.join(__dirname, 'training-data');
    }

    /**
     * Convert practice logs to Vertex AI AutoML format
     */
    async prepareAutoMLData() {
        console.log('🧠 Preparing practice logs for Vertex AI AutoML...\n');

        // Create output directory
        await fs.mkdir(this.outputDir, { recursive: true });

        // Generate different datasets
        await this.createTextClassificationDataset();
        await this.createRegressionDataset();
        await this.createMultiModalDataset();
        
        console.log('\n✅ Training data prepared successfully!');
        console.log(`📁 Output directory: ${this.outputDir}`);
    }

    /**
     * Text Classification: Predict practice quality from experience text
     */
    async createTextClassificationDataset() {
        console.log('📝 Creating text classification dataset...');

        const jsonlData = SAMPLE_PRACTICE_LOGS.map(log => ({
            textContent: log.experience,
            classificationAnnotation: {
                displayName: log.quality // high, medium, low
            }
        }));

        const jsonlContent = jsonlData.map(item => JSON.stringify(item)).join('\n');
        await fs.writeFile(
            path.join(this.outputDir, 'practice-quality-classification.jsonl'),
            jsonlContent
        );

        // Create label file
        const labels = ['high', 'medium', 'low'];
        await fs.writeFile(
            path.join(this.outputDir, 'classification-labels.txt'),
            labels.join('\n')
        );

        console.log(`   ✓ Created ${jsonlData.length} classification examples`);
    }

    /**
     * Regression: Predict coherence change from practice features
     */
    async createRegressionDataset() {
        console.log('📊 Creating regression dataset...');

        const csvHeader = 'experience,glyphId,duration,preCoherence,tags,coherenceChange';
        const csvRows = SAMPLE_PRACTICE_LOGS.map(log => 
            `"${log.experience}","${log.glyphId}",${log.duration},${log.preCoherence},"${log.tags.join(',')}",${log.coherenceChange}`
        );

        const csvContent = [csvHeader, ...csvRows].join('\n');
        await fs.writeFile(
            path.join(this.outputDir, 'coherence-prediction.csv'),
            csvContent
        );

        console.log(`   ✓ Created ${csvRows.length} regression examples`);
    }

    /**
     * Multi-modal: Combine text + structured data
     */
    async createMultiModalDataset() {
        console.log('🎯 Creating multi-modal dataset...');

        const enhancedData = SAMPLE_PRACTICE_LOGS.map(log => ({
            // Text features
            experienceText: log.experience,
            experienceLength: log.experience.length,
            wordCount: log.experience.split(' ').length,
            
            // Structured features
            glyphTier: this.getGlyphTier(log.glyphId),
            practiceTime: new Date(log.timestamp).getHours(), // hour of day
            durationMinutes: log.duration / 60,
            baselineCoherence: log.preCoherence,
            
            // Derived features
            coherenceChangeRate: log.coherenceChange / (log.duration / 60),
            tagCount: log.tags.length,
            hasEmotionalContent: log.tags.some(t => ['emotion', 'tears', 'joy', 'fear'].includes(t)),
            
            // Target
            impactCategory: this.categorizeImpact(log.coherenceChange),
            coherenceChange: log.coherenceChange
        }));

        const jsonlContent = enhancedData.map(item => JSON.stringify(item)).join('\n');
        await fs.writeFile(
            path.join(this.outputDir, 'multimodal-practice-data.jsonl'),
            jsonlContent
        );

        console.log(`   ✓ Created ${enhancedData.length} multi-modal examples`);
    }

    getGlyphTier(glyphId) {
        const num = parseInt(glyphId.substring(1));
        if (num <= 4) return 'Foundation';
        if (num <= 8) return 'Daily';
        return 'Mastery';
    }

    categorizeImpact(change) {
        if (change >= 10) return 'transformative';
        if (change >= 7) return 'significant';
        if (change >= 4) return 'moderate';
        return 'subtle';
    }

    /**
     * Generate sample GCP commands for training
     */
    async generateTrainingCommands() {
        console.log('\n🚀 Generating Vertex AI training commands...\n');

        const commands = `
# 1. Upload training data to Cloud Storage
gsutil cp ${this.outputDir}/*.jsonl gs://the-weave-sacred/vertex-ai-training/
gsutil cp ${this.outputDir}/*.csv gs://the-weave-sacred/vertex-ai-training/

# 2. Create AutoML Text Classification Dataset
gcloud ai datasets create \\
  --project=the-weave-sacred \\
  --region=us-central1 \\
  --display-name="practice-quality-classifier" \\
  --metadata-schema-uri="gs://google-cloud-aiplatform/schema/dataset/metadata/text_1.0.0.yaml"

# 3. Import training data
gcloud ai datasets import \\
  --project=the-weave-sacred \\
  --region=us-central1 \\
  --dataset=DATASET_ID \\
  --import-schema-uri="gs://google-cloud-aiplatform/schema/dataset/ioformat/text_classification_single_label_io_format_1.0.0.yaml" \\
  --input-config=training-data-config.json

# 4. Train the model
gcloud ai models upload \\
  --project=the-weave-sacred \\
  --region=us-central1 \\
  --display-name="sacred-practice-analyzer" \\
  --container-image-uri="us-docker.pkg.dev/vertex-ai/prediction/tf2-cpu.2-8:latest"

# 5. Create endpoint for predictions
gcloud ai endpoints create \\
  --project=the-weave-sacred \\
  --region=us-central1 \\
  --display-name="practice-quality-endpoint"
`;

        await fs.writeFile(
            path.join(this.outputDir, 'vertex-ai-commands.sh'),
            commands
        );

        console.log('📋 Training commands saved to vertex-ai-commands.sh');
    }

    /**
     * Generate Python notebook for advanced analysis
     */
    async generateAnalysisNotebook() {
        const notebook = `{
 "cells": [
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "# Sacred Practice Pattern Analysis\\n",
    "Analyzing consciousness patterns in practice logs"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "metadata": {},
   "outputs": [],
   "source": [
    "import pandas as pd\\n",
    "import numpy as np\\n",
    "from google.cloud import aiplatform\\n",
    "import matplotlib.pyplot as plt\\n",
    "\\n",
    "# Initialize Vertex AI\\n",
    "aiplatform.init(project='the-weave-sacred', location='us-central1')"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "metadata": {},
   "outputs": [],
   "source": [
    "# Load practice data\\n",
    "practices_df = pd.read_json('multimodal-practice-data.jsonl', lines=True)\\n",
    "\\n",
    "# Analyze patterns\\n",
    "print(f'Total practices: {len(practices_df)}')\\n",
    "print(f'Average coherence change: {practices_df.coherenceChange.mean():.2f}')\\n",
    "print(f'By tier: {practices_df.groupby(\\"glyphTier\\").coherenceChange.mean()}')"
   ]
  }
 ],
 "metadata": {
  "kernelspec": {
   "display_name": "Python 3",
   "language": "python",
   "name": "python3"
  }
 },
 "nbformat": 4,
 "nbformat_minor": 4
}`;

        await fs.writeFile(
            path.join(this.outputDir, 'practice-analysis.ipynb'),
            notebook
        );

        console.log('📓 Analysis notebook created');
    }
}

// Run the processor
async function main() {
    const processor = new PracticeLogProcessor();
    
    try {
        await processor.prepareAutoMLData();
        await processor.generateTrainingCommands();
        await processor.generateAnalysisNotebook();
        
        console.log('\n🎯 Next Steps:');
        console.log('1. Review generated training data');
        console.log('2. Upload to Cloud Storage');
        console.log('3. Create Vertex AI dataset');
        console.log('4. Train AutoML model');
        console.log('5. Deploy for sacred predictions');
        
    } catch (error) {
        console.error('❌ Error preparing data:', error);
    }
}

if (require.main === module) {
    main();
}

module.exports = { PracticeLogProcessor, SAMPLE_PRACTICE_LOGS };