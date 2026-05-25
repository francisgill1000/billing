<?php

namespace App\Http\Responses\Concerns;

use Illuminate\Support\Facades\URL;

trait RedirectsToCurrentTeam
{
    protected function redirectPathForCurrentTeam($request, string $redirect): string
    {
        $team = $this->currentTeam($request);

        if ($team) {
            URL::defaults(['current_team' => $team->slug]);
        }

        return $redirect;
    }

    protected function currentTeam($request)
    {
        $user = $request->user();

        return $user?->currentTeam ?? $user?->personalTeam();
    }
}
