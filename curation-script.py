#!/usr/bin/env python3
"""
Repository Curation Script - Phase 1: Remove Low-Value Repositories
"""
import json

def remove_low_value_repos():
    # Load current metadata
    with open('repository-metadata.json', 'r') as f:
        metadata = json.load(f)
    
    # Low-value repositories to exclude
    repos_to_remove = [
        'sample-arch-package',           # Generic template, low value (Score: 47)
        'axiom-loom-ai-experience-center', # Self-referential, low value (Score: 47)
        'ai-transformations',            # Too generic (Score: 50)
        'ecosystem-platform-architecture', # Duplicate/generic (Score: 56)
        'copilot-architecture-template'  # GitHub-specific, limited scope (Score: 56)
    ]
    
    # Track removed repos
    removed_repos = []
    
    # Remove low-value repositories
    for repo_id in repos_to_remove:
        if repo_id in metadata:
            removed_repos.append({
                'id': repo_id,
                'displayName': metadata[repo_id].get('displayName', repo_id),
                'valueScore': metadata[repo_id].get('pricing', {}).get('valueScore'),
                'reason': 'Low value score or duplicate functionality'
            })
            del metadata[repo_id]
            print(f"✅ Removed: {repo_id}")
        else:
            print(f"⚠️  Not found: {repo_id}")
    
    # Create backup
    with open('repository-metadata.backup.json', 'w') as f:
        json.dump(metadata, f, indent=2)
    
    # Save updated metadata
    with open('repository-metadata.json', 'w') as f:
        json.dump(metadata, f, indent=2)
    
    # Create curation report
    curation_report = {
        'phase': 'Phase 1: Immediate Implementation',
        'action': 'Remove Low-Value Repositories',
        'timestamp': '2025-01-29',
        'removed_repositories': removed_repos,
        'remaining_repositories': len(metadata),
        'next_steps': [
            'Phase 2: Consolidate Future Mobility suite',
            'Phase 2: Break out NSLabs repository',
            'Phase 3: Enhance documentation and APIs'
        ]
    }
    
    with open('curation-report-phase1.json', 'w') as f:
        json.dump(curation_report, f, indent=2)
    
    print(f"\n📊 Curation Summary:")
    print(f"   Removed: {len(removed_repos)} repositories")
    print(f"   Remaining: {len(metadata)} repositories")
    print(f"   Backup saved: repository-metadata.backup.json")
    print(f"   Report saved: curation-report-phase1.json")

if __name__ == "__main__":
    remove_low_value_repos()