<?php

namespace Justoverclock\ProfileComments\Api\Controller;

use Flarum\Api\Controller\AbstractListController;
use Illuminate\Support\Arr;
use Justoverclock\ProfileComments\Api\Serializers\UserCommentSerializer;
use Justoverclock\ProfileComments\Model\UserCommentsModel;
use Psr\Http\Message\ServerRequestInterface as Request;
use Tobscure\JsonApi\Document;

class ListUserCommentsController extends AbstractListController
{
    public $serializer = UserCommentSerializer::class;

    protected function data(Request $request, Document $document)
    {
        $actor = $request->getAttribute('actor');

        if ($actor->exists) {
            $userId = Arr::get($request->getQueryParams(), 'filter.userId');
            return UserCommentsModel::query()
                ->with('commentedBy')
                ->where('user_id', $userId)
                ->get();
        }

        return [];
    }
}
