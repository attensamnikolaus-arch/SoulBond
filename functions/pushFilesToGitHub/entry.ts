import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { files, commit_message, repo_name } = body;
    const token = Deno.env.get('GITHUB_TOKEN');
    if (!token) return Response.json({ error: 'GITHUB_TOKEN not set' }, { status: 500 });

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'SoulBond-App',
    };

    // 1. Get authenticated user (owner)
    const userRes = await fetch('https://api.github.com/user', { headers });
    const userData = await userRes.json();
    const owner = userData.login;
    const repo = repo_name || 'SoulBond';

    // 2. Get default branch ref
    const refRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/refs/heads/main`, { headers });
    if (!refRes.ok) {
      const errText = await refRes.text();
      return Response.json({ error: `Failed to get branch ref: ${errText}` }, { status: 500 });
    }
    const refData = await refRes.json();
    const latestCommitSha = refData.object.sha;

    // 3. Get current commit's tree
    const commitRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/commits/${latestCommitSha}`, { headers });
    const commitData = await commitRes.json();
    const baseTreeSha = commitData.tree.sha;

    // 4. Create blobs for all files
    const treeEntries = [];
    for (const file of files) {
      const blobRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/blobs`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          content: file.content,
          encoding: file.encoding || 'utf-8',
        }),
      });
      if (!blobRes.ok) {
        const errText = await blobRes.text();
        return Response.json({ error: `Failed to create blob for ${file.path}: ${errText}` }, { status: 500 });
      }
      const blobData = await blobRes.json();
      treeEntries.push({
        path: file.path,
        mode: '100644',
        type: 'blob',
        sha: blobData.sha,
      });
    }

    // 5. Create new tree
    const treeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        base_tree: baseTreeSha,
        tree: treeEntries,
      }),
    });
    if (!treeRes.ok) {
      const errText = await treeRes.text();
      return Response.json({ error: `Failed to create tree: ${errText}` }, { status: 500 });
    }
    const treeData = await treeRes.json();

    // 6. Create commit
    const newCommitRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/commits`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        message: commit_message || 'Push source code',
        tree: treeData.sha,
        parents: [latestCommitSha],
      }),
    });
    if (!newCommitRes.ok) {
      const errText = await newCommitRes.text();
      return Response.json({ error: `Failed to create commit: ${errText}` }, { status: 500 });
    }
    const newCommitData = await newCommitRes.json();

    // 7. Update ref
    const updateRefRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/refs/heads/main`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ sha: newCommitData.sha }),
    });
    if (!updateRefRes.ok) {
      const errText = await updateRefRes.text();
      return Response.json({ error: `Failed to update ref: ${errText}` }, { status: 500 });
    }

    return Response.json({
      success: true,
      commit_sha: newCommitData.sha,
      commit_url: `https://github.com/${owner}/${repo}/commit/${newCommitData.sha}`,
      files_pushed: files.length,
      owner,
      repo,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});