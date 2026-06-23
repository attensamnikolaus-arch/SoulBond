import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const repoName = body.repo_name || 'SoulBond';
    const description = body.description || 'SoulBond — Virtual & physical animal adoption platform';
    const isPrivate = body.private ?? false;

    const token = Deno.env.get('GITHUB_TOKEN');
    if (!token) return Response.json({ error: 'GITHUB_TOKEN secret not set' }, { status: 500 });

    const response = await fetch('https://api.github.com/user/repos', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'SoulBond-App',
      },
      body: JSON.stringify({
        name: repoName,
        description,
        private: isPrivate,
        auto_init: true,
      }),
    });

    const responseText = await response.text();
    let data;
    try { data = JSON.parse(responseText); } catch { data = { raw: responseText }; }

    if (!response.ok) {
      return Response.json({ error: data.message || data.raw || 'GitHub API error', details: data, status_code: response.status }, { status: response.status });
    }

    return Response.json({
      success: true,
      repo_url: data.html_url,
      clone_url: data.clone_url,
      repo_name: data.name,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});